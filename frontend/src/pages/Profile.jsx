import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, FileText, Edit3, Save, Camera, 
  Upload, X, Loader2, Navigation, CheckCircle, AlertCircle, 
  Home as HomeIcon, Trash2, KeyRound, Award
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Profile = ({ isInsideSettings = false }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Track auto-save states for individual fields
  const [savingFields, setSavingFields] = useState({
    name: false,
    phone: false,
    collegeName: false,
    bio: false,
    address: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    phone: '',
    collegeName: '',
    bio: '',
    address: ''
  });

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', bio: '', address: '', collegeName: '',
    profileImage: '', profilePhoto: '', location: { latitude: null, longitude: null, fullAddress: '' },
    createdAt: ''
  });

  const [originalProfile, setOriginalProfile] = useState({});

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/profile');
      const profileData = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        address: data.address || '',
        collegeName: data.collegeName || '',
        profileImage: data.profileImage || data.profilePhoto || '',
        profilePhoto: data.profilePhoto || data.profileImage || '',
        location: data.location || { latitude: null, longitude: null, fullAddress: '' },
        createdAt: data.createdAt || ''
      };
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (err) {
      if (user) {
        const fallbackData = {
          ...profile,
          name: user.name || '',
          email: user.email || '',
          collegeName: user.collegeName || '',
          profileImage: user.profileImage || user.profilePhoto || '',
          profilePhoto: user.profilePhoto || user.profileImage || '',
        };
        setProfile(fallbackData);
        setOriginalProfile(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Dynamically calculate completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (profile.email) score += 20;
    if (profile.name && profile.name.trim() !== '') score += 20;
    if (profile.phone && profile.phone.trim() !== '') score += 20;
    if (profile.profileImage || profile.profilePhoto) score += 20;
    if (profile.bio && profile.bio.trim() !== '') score += 10;
    if (profile.address && profile.address.trim() !== '') score += 10;
    return score;
  };

  const validateField = (name, value) => {
    if (name === 'name' && (!value || value.trim() === '')) {
      return 'Name cannot be empty';
    }
    if (name === 'phone' && value && value.trim() !== '') {
      const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
      if (!phoneRegex.test(value.trim())) {
        return 'Please enter a valid phone number';
      }
    }
    if (name === 'bio' && value && value.length > 500) {
      return 'Bio must not exceed 500 characters';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Auto-saves an individual field on Blur
  const handleFieldBlur = async (fieldName) => {
    const value = profile[fieldName];
    const error = validateField(fieldName, value);
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
      toast.error(error);
      return;
    }

    // Only update if the value has changed
    if (value === originalProfile[fieldName]) {
      return;
    }

    try {
      setSavingFields(prev => ({ ...prev, [fieldName]: true }));
      const { data } = await API.put('/profile/update', {
        [fieldName]: value
      });
      
      const updatedProfile = {
        ...profile,
        [fieldName]: data[fieldName]
      };
      
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      updateUser(data);
      toast.success(`Saved ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to auto-save ${fieldName}`);
      // Revert field to original on error
      setProfile(prev => ({ ...prev, [fieldName]: originalProfile[fieldName] }));
    } finally {
      setSavingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  // Explicit full update triggered by manual Save Changes button
  const handleSave = async () => {
    // Run validation across all fields
    const errors = {
      name: validateField('name', profile.name),
      phone: validateField('phone', profile.phone),
      bio: validateField('bio', profile.bio),
      address: validateField('address', profile.address),
      collegeName: validateField('collegeName', profile.collegeName),
    };

    setFieldErrors(errors);
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      toast.error('Please correct the validation errors first');
      return;
    }

    try {
      setSaving(true);
      const { data } = await API.put('/profile/update', {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        address: profile.address,
        collegeName: profile.collegeName,
        location: profile.location
      });
      updateUser(data);
      const updatedProfile = {
        ...profile,
        ...data
      };
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);
      toast.success('✅ Profile Updated Successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // --- PHOTO UPLOAD ---
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await processAndUploadImage(file);
  };

  const processAndUploadImage = async (file) => {
    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error('Only image files (jpg, png, webp, gif) are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be under 5MB');
    }

    setPhotoPreview(URL.createObjectURL(file));
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    try {
      setUploadingPhoto(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await API.post('/profile/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      const newImageUrl = data.profileImage;
      setProfile(prev => ({ ...prev, profileImage: newImageUrl, profilePhoto: newImageUrl }));
      updateUser({ profileImage: newImageUrl, profilePhoto: newImageUrl });
      
      // Update original profile state
      setOriginalProfile(prev => ({ ...prev, profileImage: newImageUrl, profilePhoto: newImageUrl }));
      toast.success('📸 Profile image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingPhoto(false);
      setPhotoPreview(null);
      setUploadProgress(0);
    }
  };

  // --- REMOVE PHOTO ---
  const handleRemovePhoto = async () => {
    if (!profile.profileImage && !profile.profilePhoto) {
      toast.info('No profile photo exists');
      return;
    }
    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }
    try {
      setUploadingPhoto(true);
      const { data } = await API.delete('/profile/remove-image');
      setProfile(prev => ({ ...prev, profileImage: '', profilePhoto: '' }));
      updateUser({ profileImage: '', profilePhoto: '' });
      setOriginalProfile(prev => ({ ...prev, profileImage: '', profilePhoto: '' }));
      toast.success('🗑️ Profile photo removed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // --- DRAG & DROP ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processAndUploadImage(e.dataTransfer.files[0]);
    }
  };

  // --- CAMERA ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => { 
        if (videoRef.current) videoRef.current.srcObject = stream; 
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error('Unable to access webcam. Please check camera permissions.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setPhotoPreview(URL.createObjectURL(blob));
      stopCamera();
      
      // Upload using capture-image API
      try {
        setUploadingPhoto(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('image', file);
        
        const { data } = await API.post('/profile/capture-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        
        setProfile(prev => ({ ...prev, profileImage: data.profileImage, profilePhoto: data.profileImage }));
        updateUser({ profileImage: data.profileImage, profilePhoto: data.profileImage });
        setOriginalProfile(prev => ({ ...prev, profileImage: data.profileImage, profilePhoto: data.profileImage }));
        toast.success('📸 Camera snapshot saved!');
      } catch (err) {
        toast.error('Failed to upload camera snap');
      } finally {
        setUploadingPhoto(false);
        setPhotoPreview(null);
        setUploadProgress(0);
      }
    }, 'image/jpeg', 0.95);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  // --- LOCATION ---
  const fetchLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation is not supported by your browser');
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const geo = await resp.json();
          const fullAddress = geo.display_name || `${latitude}, ${longitude}`;
          
          setProfile(prev => ({
            ...prev,
            address: fullAddress,
            location: { latitude, longitude, fullAddress }
          }));
          toast.success('📍 Coordinates resolved successfully!');
        } catch {
          setProfile(prev => ({
            ...prev,
            location: { latitude, longitude, fullAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }
          }));
          toast.info('Fetched latitude and longitude coordinates.');
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => { 
        setFetchingLocation(false); 
        toast.error(`Location access denied: ${err.message}`); 
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // --- PASSWORD UPDATE ---
  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setChangingPassword(true);
      const { data } = await API.put('/profile/change-password', {
        oldPassword,
        newPassword
      });
      toast.success(data.message || '🔒 Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordChange(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const getPhotoUrl = () => {
    if (photoPreview) return photoPreview;
    const imgPath = profile.profileImage || profile.profilePhoto;
    if (imgPath) {
      return imgPath.startsWith('http') ? imgPath : `http://localhost:5000${imgPath}`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || 'user'}`;
  };

  const formattedJoinDate = () => {
    if (!profile.createdAt) return 'Recent Member';
    try {
      const date = new Date(profile.createdAt);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Joined Member';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          <p className="text-gray-400 animate-pulse text-sm">Loading profile dashboard...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletion();

  const renderCardContent = () => (
    <motion.div 
      initial={isInsideSettings ? { opacity: 0 } : { opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={isInsideSettings ? {} : { delay: 0.1 }}
      className={`relative z-10 ${isInsideSettings ? '' : 'glass-card p-6 md:p-8'}`}
    >
      {/* Photo Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8 pb-8 border-b border-white/10">
        <div 
          className="relative group cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Drag and Drop an image, or click button to upload"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className={`w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 transition-colors relative bg-navy-800 ${
              isDragging ? 'border-secondary shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]'
            }`}
          >
            <img src={getPhotoUrl()} alt="Profile" className="w-full h-full object-cover" />
            
            {/* Uploading Spinner & Overlay */}
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                <span className="text-[10px] text-secondary font-bold mt-1">{uploadProgress}%</span>
              </div>
            )}
            
            {/* Drag & Drop Hover Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                <p className="text-[11px] font-bold text-secondary text-center px-2">Drop File Here</p>
              </div>
            )}
          </motion.div>
          
          {/* Picture Controls */}
          {isEditing && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-navy-900 border border-white/10 p-1.5 rounded-full shadow-xl">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-primary rounded-full text-white hover:shadow-primary/30 transition-all" 
                title="Upload Photo"
              >
                <Upload className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={startCamera}
                className="p-2 bg-secondary rounded-full text-navy-900 hover:shadow-secondary/30 transition-all" 
                title="Capture with Camera"
              >
                <Camera className="w-3.5 h-3.5" />
              </motion.button>
              {(profile.profileImage || profile.profilePhoto) && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={handleRemovePhoto}
                  className="p-2 bg-red-500 rounded-full text-white hover:shadow-red-500/30 transition-all" 
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        <div className="text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white truncate">{profile.name || 'Your Name'}</h2>
            {isInsideSettings && (
              <div className="flex space-x-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={saving}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                    isEditing
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white'
                      : 'bg-gradient-to-r from-primary to-primary-light hover:shadow-[0_0_20px_rgba(255,0,122,0.3)] text-white'
                  }`}
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </motion.button>
              </div>
            )}
          </div>
          <p className="text-secondary text-sm font-medium mt-1">{profile.email}</p>
          <p className="text-gray-400 text-xs mt-1">Member Since: {formattedJoinDate()}</p>
          {profile.bio && <p className="text-gray-400 text-sm mt-3 line-clamp-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">{profile.bio}</p>}
        </div>
      </div>

      {/* Camera Capture Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card p-6 max-w-lg w-full border border-white/15 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center"><Camera className="w-5 h-5 mr-2 text-secondary"/> Take Profile Snap</h3>
                <button onClick={stopCamera} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="rounded-xl overflow-hidden bg-black mb-4 aspect-video border border-white/10">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex space-x-3">
                <button onClick={stopCamera} className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={capturePhoto}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-[0_0_20px_rgba(255,0,122,0.3)] transition-all text-white"
                >
                  <Camera className="w-5 h-5 text-white" /><span>Capture & Upload</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ProfileField 
          icon={<User className="w-4 h-4" />} 
          label="Full Name" 
          name="name" 
          value={profile.name} 
          onChange={handleChange} 
          onBlur={() => handleFieldBlur('name')}
          isSaving={savingFields.name}
          error={fieldErrors.name}
          editable={isEditing} 
        />
        <ProfileField 
          icon={<Mail className="w-4 h-4" />} 
          label="Email" 
          name="email" 
          value={profile.email} 
          editable={false} 
          hint="Cannot be changed" 
        />
        <ProfileField 
          icon={<Phone className="w-4 h-4" />} 
          label="Phone Number" 
          name="phone" 
          value={profile.phone} 
          onChange={handleChange} 
          onBlur={() => handleFieldBlur('phone')}
          isSaving={savingFields.phone}
          error={fieldErrors.phone}
          editable={isEditing} 
          placeholder="+91 99999 99999" 
        />
        <ProfileField 
          icon={<HomeIcon className="w-4 h-4" />} 
          label="Campus / Institute" 
          name="collegeName" 
          value={profile.collegeName} 
          onChange={handleChange} 
          onBlur={() => handleFieldBlur('collegeName')}
          isSaving={savingFields.collegeName}
          error={fieldErrors.collegeName}
          editable={isEditing} 
        />

        {/* Bio - Full Width */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" /><span>Bio / About</span>
            </label>
            {savingFields.bio && <span className="text-[10px] text-secondary flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Saving...</span>}
          </div>
          {isEditing ? (
            <div>
              <textarea 
                name="bio" 
                value={profile.bio} 
                onChange={handleChange} 
                onBlur={() => handleFieldBlur('bio')}
                rows={3}
                className={`w-full bg-white/5 border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all resize-none text-sm ${
                  fieldErrors.bio ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="Tell us about yourself..."
              />
              {fieldErrors.bio && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.bio}</span>}
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-300 min-h-[80px]">
              {profile.bio || <span className="text-gray-600 italic">No bio added yet</span>}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /><span>Address</span>
            </label>
            {savingFields.address && <span className="text-[10px] text-secondary flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Saving...</span>}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <textarea 
                name="address" 
                value={profile.address} 
                onChange={handleChange} 
                onBlur={() => handleFieldBlur('address')}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all resize-none text-sm"
                placeholder="Your campus address..."
              />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={fetchLocation} disabled={fetchingLocation}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl text-sm font-medium text-blue-300 hover:border-blue-400/50 transition-all"
              >
                {fetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                <span>{fetchingLocation ? 'Fetching location...' : '📍 Use My Location'}</span>
              </motion.button>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-300">
              {profile.address || <span className="text-gray-600 italic">No address added</span>}
            </div>
          )}
        </div>

        {/* Location Coordinates */}
        {profile.location?.latitude && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="md:col-span-2"
          >
            <div className="flex items-center space-x-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-green-300 font-medium">GPS Coordinates Resolved</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Latitude: {profile.location.latitude?.toFixed(6)} &nbsp;|&nbsp; Longitude: {profile.location.longitude?.toFixed(6)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Password Management Block */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <button 
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10"
        >
          <KeyRound className="w-4 h-4" />
          <span>{showPasswordChange ? 'Hide Password Management' : 'Change Password Security'}</span>
        </button>
        
        <AnimatePresence>
          {showPasswordChange && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5"
            >
              <h3 className="text-base font-bold text-white mb-4 flex items-center"><KeyRound className="w-4 h-4 mr-2 text-primary" /> Update Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400">Current Password</label>
                  <input 
                    type="password" 
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm text-white" 
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm text-white" 
                    placeholder="Enter new password (min. 6 chars)"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm text-white" 
                    placeholder="Confirm new password"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={changingPassword}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl text-xs hover:shadow-[0_0_15px_rgba(255,0,122,0.3)] transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {changingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                  <span>Change Password</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  if (isInsideSettings) {
    return renderCardContent();
  }

  return (
    <div className="min-h-[80vh] px-4 py-8 md:py-12 max-w-4xl mx-auto relative">
      {/* Background decoration blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Profile Info */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">User Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage personal details, security, and profile image</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            isEditing
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white'
              : 'bg-gradient-to-r from-primary to-primary-light hover:shadow-[0_0_20px_rgba(255,0,122,0.3)] text-white'
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </motion.button>
      </motion.div>

      {renderCardContent()}
    </div>
  );
};

// Reusable dynamic field component
const ProfileField = ({ icon, label, name, value, onChange, onBlur, isSaving, error, editable, placeholder, hint }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {icon}<span>{label}</span>
      </label>
      {isSaving && <span className="text-[10px] text-secondary flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Saving...</span>}
    </div>
    {editable ? (
      <div>
        <input 
          type="text" 
          name={name} 
          value={value} 
          onChange={onChange} 
          onBlur={onBlur}
          className={`w-full bg-white/5 border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm ${
            error ? 'border-red-500' : 'border-white/10'
          }`}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
        {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
      </div>
    ) : (
      <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-sm text-gray-300">
        {value || <span className="text-gray-600 italic">Not provided</span>}
        {hint && <span className="text-gray-600 text-[10px] ml-2">({hint})</span>}
      </div>
    )}
  </div>
);

export default Profile;
