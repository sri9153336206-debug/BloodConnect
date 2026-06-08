import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplets,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Calendar,
  Shield,
  LogOut,
  Trash2,
  Eye,
  Lock,
  Clock,
  XCircle,
} from 'lucide-react'
import { useAuth }    from '../context/AuthContext.jsx'
import { useDonors }  from '../context/DonorContext.jsx'
import { useUI }      from '../context/UIContext.jsx'
import Input, { SelectInput } from '../components/ui/Input.jsx'
import Button                 from '../components/ui/Button.jsx'
import {
  AvailabilityBadge,
  BloodGroupBadge,
  RoleBadge,
  DonationBadge,
  StatusBadge,
} from '../components/ui/Badge.jsx'
import { OverlayLoader }    from '../components/ui/Loader.jsx'
import { DeleteModal, LogoutModal } from '../components/ui/Modal.jsx'
import BloodGroupSelector   from '../components/features/BloodGroupSelector.jsx'
import {
  validateProfileForm,
  validatePassword,
  validateConfirmPassword,
  hasErrors,
  formatDate,
  formatPhone,
} from '../utils/validators.js'
import { CITIES } from '../constants/index.js'

// ════════════════════════════════════════════════════
//  PROFILE PAGE
// ════════════════════════════════════════════════════
const ProfilePage = () => {

  const navigate = useNavigate()
  const {
    currentUser,
    isLoggedIn,
    isDonor,
    logout,
    updateProfile,
    updatePassword,
    deleteAccount,
    loading,
    syncProfile,
  } = useAuth()

  // ── Sync user profile on mount ───────────────────
  useEffect(() => {
    if (isLoggedIn) {
      syncProfile()
    }
  }, [isLoggedIn])

  const { getDonorFromState, toggleAvailability } = useDonors()
  const { showSuccess, showError, openDeleteModal } = useUI()

  // ── Get Donor Data If User Is A Donor ─────────────
  const donorData = isDonor && currentUser?.donorId
    ? getDonorFromState(currentUser.donorId)
    : null

  // ── State ─────────────────────────────────────────
  const [activeTab,       setActiveTab]       = useState('profile')
  const [isEditing,       setIsEditing]       = useState(false)
  const [submitting,      setSubmitting]       = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [imgError,        setImgError]        = useState(false)

  // ── Profile Form ──────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name:       currentUser?.name       ?? '',
    phone:      currentUser?.phone      ?? '',
    location:   currentUser?.location   ?? '',
    bloodGroup: currentUser?.bloodGroup ?? '',
  })
  const [profileErrors, setProfileErrors] = useState({})

  // ── Password Form ─────────────────────────────────
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [passErrors,   setPassErrors]   = useState({})
  const [passLoading,  setPassLoading]  = useState(false)
  const [passSuccess,  setPassSuccess]  = useState(false)

  // ── Sync Form When User Changes ───────────────────
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name:       currentUser.name       ?? '',
        phone:      currentUser.phone      ?? '',
        location:   currentUser.location   ?? '',
        bloodGroup: currentUser.bloodGroup ?? '',
      })
    }
  }, [currentUser])

  // ── Handle Profile Field Change ───────────────────
  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // ── Handle Profile Save ───────────────────────────
  const handleProfileSave = async () => {
    const errors = validateProfileForm(profileForm)
    if (hasErrors(errors)) {
      setProfileErrors(errors)
      return
    }
    setSubmitting(true)
    try {
      await updateProfile(profileForm)
      setIsEditing(false)
      showSuccess('Profile updated successfully!')
    } catch (err) {
      showError(err.message ?? 'Failed to update profile.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Handle Cancel Edit ────────────────────────────
  const handleCancelEdit = () => {
    setIsEditing(false)
    setProfileErrors({})
    setProfileForm({
      name:       currentUser?.name       ?? '',
      phone:      currentUser?.phone      ?? '',
      location:   currentUser?.location   ?? '',
      bloodGroup: currentUser?.bloodGroup ?? '',
    })
  }

  // ── Handle Password Change ────────────────────────
  const handlePasswordChange = async (e) => {
    e?.preventDefault()
    const errors = {}
    const currErr = validatePassword(passForm.currentPassword)
    const newErr  = validatePassword(passForm.newPassword)
    const confErr = validateConfirmPassword(
      passForm.newPassword,
      passForm.confirmPassword
    )
    if (currErr) errors.currentPassword = currErr
    if (newErr)  errors.newPassword     = newErr
    if (confErr) errors.confirmPassword = confErr

    if (hasErrors(errors)) {
      setPassErrors(errors)
      return
    }

    setPassLoading(true)
    try {
      await updatePassword(
        passForm.currentPassword,
        passForm.newPassword
      )
      setPassSuccess(true)
      setPassForm({
        currentPassword: '',
        newPassword:     '',
        confirmPassword: '',
      })
      showSuccess('Password changed successfully!')
      setTimeout(() => setPassSuccess(false), 3000)
    } catch (err) {
      showError(err.message ?? 'Failed to change password.')
    } finally {
      setPassLoading(false)
    }
  }

  // ── Handle Toggle Availability ────────────────────
  const handleToggleAvailability = async () => {
    if (!donorData) return
    try {
      await toggleAvailability(donorData.id)
      showSuccess(
        donorData.availability
          ? 'Marked as unavailable.'
          : 'Marked as available!'
      )
    } catch {
      showError('Failed to update availability.')
    }
  }

  // ── Handle Logout ─────────────────────────────────
  const handleLogout = () => {
    logout()
    showSuccess('Logged out successfully!')
    navigate('/')
  }

  // ── Handle Delete Account ─────────────────────────
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      showSuccess('Account deleted.')
      navigate('/')
    } catch (err) {
      showError(err.message ?? 'Failed to delete account.')
    }
  }

  // ── Initials ──────────────────────────────────────
  const initials = currentUser?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??'

  // ── Tabs ──────────────────────────────────────────
  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: <User     size={15} /> },
    { id: 'security', label: 'Security', icon: <Lock     size={15} /> },
    { id: 'donor',    label: 'Donor',    icon: <Droplets size={15} /> },
  ]

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══════════════════════════════════════════
             PAGE HEADER
        ══════════════════════════════════════════ */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your account information and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Profile Card ─────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Avatar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

              {/* Cover */}
              <div className="h-20 bg-gradient-to-r from-red-500 to-red-700" />

              {/* Avatar + Info */}
              <div className="px-5 pb-5">
                <div className="relative -mt-10 mb-4">
                  <div className={[
                    'w-20 h-20 rounded-2xl border-4 border-white shadow-lg',
                    'bg-red-600 text-white',
                    'flex items-center justify-center',
                    'text-xl font-bold',
                  ].join(' ')}>
                    {initials}
                  </div>
                  {isDonor && (
                    <span className={[
                      'absolute -bottom-1 -right-1',
                      'w-6 h-6 rounded-full border-2 border-white',
                      'bg-red-600',
                      'flex items-center justify-center',
                    ].join(' ')}>
                      <Droplets size={12} className="text-white" />
                    </span>
                  )}
                </div>

                {/* Name + Role */}
                <h2 className="font-bold text-gray-900 text-lg">
                  {currentUser?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  {currentUser?.email}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <RoleBadge role={currentUser?.role} />
                  {currentUser?.donorStatus && currentUser.donorStatus !== 'approved' && (
                    <StatusBadge status={currentUser.donorStatus} size="sm" />
                  )}
                  {currentUser?.bloodGroup && (
                    <BloodGroupBadge
                      bloodGroup={currentUser.bloodGroup}
                      size="sm"
                    />
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                <QuickInfoRow
                  icon={<Mail   size={14} />}
                  value={currentUser?.email}
                />
                <QuickInfoRow
                  icon={<Phone  size={14} />}
                  value={formatPhone(currentUser?.phone) ?? 'Not set'}
                />
                <QuickInfoRow
                  icon={<MapPin size={14} />}
                  value={currentUser?.location ?? 'Not set'}
                />
                <QuickInfoRow
                  icon={<Calendar size={14} />}
                  value={`Joined ${formatDate(currentUser?.createdAt)}`}
                />
              </div>

            </div>

            {/* Donor Stats (if donor) */}
            {isDonor && donorData && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Droplets size={15} className="text-red-500" />
                  My Donations
                </h3>

                <div className="text-center py-3">
                  <div className={[
                    'w-16 h-16 rounded-full',
                    'bg-red-100 text-red-600',
                    'flex items-center justify-center',
                    'mx-auto mb-3',
                  ].join(' ')}>
                    <Droplets size={28} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {donorData.donationsCount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Donations
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Donated</span>
                    <span className="font-medium text-gray-700">
                      {formatDate(donorData.lastDonationDate)}
                    </span>
                  </div>
                </div>

                {/* View Donor Profile */}
                <button
                  type="button"
                  onClick={() => navigate(`/donor/${donorData.id}`)}
                  className={[
                    'w-full mt-4 py-2 rounded-xl',
                    'border border-gray-200',
                    'text-sm font-medium text-gray-600',
                    'hover:border-red-300 hover:text-red-600',
                    'transition-all duration-200',
                    'flex items-center justify-center gap-2',
                  ].join(' ')}
                >
                  <Eye size={14} />
                  View Donor Profile
                </button>

              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Shield size={15} className="text-gray-400" />
                Account Actions
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className={[
                    'w-full flex items-center gap-3',
                    'px-4 py-3 rounded-xl',
                    'text-sm font-medium text-gray-600',
                    'hover:bg-gray-50 border border-gray-100',
                    'transition-colors duration-150',
                  ].join(' ')}
                >
                  <LogOut size={16} className="text-gray-400" />
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className={[
                    'w-full flex items-center gap-3',
                    'px-4 py-3 rounded-xl',
                    'text-sm font-medium text-red-600',
                    'hover:bg-red-50 border border-red-100',
                    'transition-colors duration-150',
                  ].join(' ')}
                >
                  <Trash2 size={16} className="text-red-400" />
                  Delete Account
                </button>
              </div>
            </div>

          </div>

          {/* ── Right: Tabs ────────────────────── */}
          <div className="lg:col-span-2">

            {/* Tab Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 mb-4">
              <div className="flex border-b border-gray-100">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsEditing(false)
                    }}
                    className={[
                      'flex-1 flex items-center justify-center gap-2',
                      'py-4 text-sm font-semibold',
                      'border-b-2 transition-all duration-200',
                      activeTab === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    ].join(' ')}
                    aria-selected={activeTab === tab.id}
                  >
                    {tab.icon}
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Profile Tab ─────────────────── */}
              {activeTab === 'profile' && (
                <div className="p-6 relative">
                  <OverlayLoader
                    visible={submitting}
                    message="Saving profile..."
                  />

                  {/* Tab Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">
                      Personal Information
                    </h3>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        leftIcon={<Edit3 size={14} />}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                          leftIcon={<X size={14} />}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleProfileSave}
                          loading={submitting}
                          leftIcon={<Save size={14} />}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        value={profileForm.name}
                        onChange={e => handleProfileChange('name', e.target.value)}
                        error={profileErrors.name}
                        required
                        leftIcon={<User size={16} />}
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={profileForm.phone}
                        onChange={e => handleProfileChange('phone', e.target.value)}
                        error={profileErrors.phone}
                        leftIcon={<Phone size={16} />}
                        maxLength={10}
                      />
                      <SelectInput
                        label="Location"
                        value={profileForm.location}
                        onChange={e => handleProfileChange('location', e.target.value)}
                        options={CITIES.map(c => ({ label: c, value: c }))}
                        placeholder="Select your city"
                      />
                      <BloodGroupSelector
                        label="Blood Group"
                        value={profileForm.bloodGroup}
                        onChange={val => handleProfileChange('bloodGroup', val)}
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ProfileInfoRow
                        icon={<User     size={16} />}
                        label="Full Name"
                        value={currentUser?.name}
                      />
                      <ProfileInfoRow
                        icon={<Mail     size={16} />}
                        label="Email"
                        value={currentUser?.email}
                      />
                      <ProfileInfoRow
                        icon={<Phone    size={16} />}
                        label="Phone"
                        value={formatPhone(currentUser?.phone) ?? 'Not set'}
                      />
                      <ProfileInfoRow
                        icon={<MapPin   size={16} />}
                        label="Location"
                        value={currentUser?.location ?? 'Not set'}
                      />
                      <ProfileInfoRow
                        icon={<Droplets size={16} />}
                        label="Blood Group"
                        value={currentUser?.bloodGroup ?? 'Not set'}
                        valueClass={
                          currentUser?.bloodGroup
                            ? 'font-bold text-red-600'
                            : 'text-gray-400'
                        }
                      />
                      <ProfileInfoRow
                        icon={<Calendar size={16} />}
                        label="Member Since"
                        value={formatDate(currentUser?.createdAt)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── Security Tab ─────────────────── */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-6">
                    Change Password
                  </h3>

                  {passSuccess && (
                    <div className={[
                      'flex items-center gap-2 p-3 mb-4',
                      'bg-green-50 border border-green-200 rounded-xl',
                      'animate-fade-in',
                    ].join(' ')}>
                      <CheckCircle2 size={16} className="text-green-500" />
                      <p className="text-sm text-green-700 font-medium">
                        Password changed successfully!
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-4"
                  >
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                      value={passForm.currentPassword}
                      onChange={e => {
                        setPassForm(prev => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                        if (passErrors.currentPassword) {
                          setPassErrors(prev => ({
                            ...prev,
                            currentPassword: '',
                          }))
                        }
                      }}
                      error={passErrors.currentPassword}
                      leftIcon={<Lock size={16} />}
                      required
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      value={passForm.newPassword}
                      onChange={e => {
                        setPassForm(prev => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                        if (passErrors.newPassword) {
                          setPassErrors(prev => ({
                            ...prev,
                            newPassword: '',
                          }))
                        }
                      }}
                      error={passErrors.newPassword}
                      leftIcon={<Lock size={16} />}
                      required
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Re-enter new password"
                      value={passForm.confirmPassword}
                      onChange={e => {
                        setPassForm(prev => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                        if (passErrors.confirmPassword) {
                          setPassErrors(prev => ({
                            ...prev,
                            confirmPassword: '',
                          }))
                        }
                      }}
                      error={passErrors.confirmPassword}
                      leftIcon={<Lock size={16} />}
                      required
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      loading={passLoading}
                      leftIcon={<Save size={16} />}
                    >
                      Update Password
                    </Button>
                  </form>
                </div>
              )}

              {/* ── Donor Tab ───────────────────── */}
              {activeTab === 'donor' && (
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-6">
                    Donor Settings
                  </h3>

                  {isDonor && donorData ? (
                    <div className="space-y-5">

                      {/* Availability Toggle */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Availability Status
                        </label>
                        <button
                          type="button"
                          onClick={handleToggleAvailability}
                          className={[
                            'w-full flex items-center justify-between',
                            'px-4 py-4 rounded-xl border-2',
                            'transition-all duration-200',
                            donorData.availability
                              ? 'bg-green-50 border-green-400'
                              : 'bg-gray-50 border-gray-200',
                          ].join(' ')}
                          aria-pressed={donorData.availability}
                        >
                          <div>
                            <p className={[
                              'font-semibold text-sm',
                              donorData.availability
                                ? 'text-green-700'
                                : 'text-gray-600',
                            ].join(' ')}>
                              {donorData.availability
                                ? 'Available for donation'
                                : 'Not available right now'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Toggle to update your status
                            </p>
                          </div>
                          <div className={[
                            'relative w-12 h-6 rounded-full',
                            'transition-colors duration-200',
                            donorData.availability
                              ? 'bg-green-500'
                              : 'bg-gray-300',
                          ].join(' ')}>
                            <div className={[
                              'absolute top-1 w-4 h-4',
                              'rounded-full bg-white shadow',
                              'transition-transform duration-200',
                              donorData.availability
                                ? 'translate-x-7'
                                : 'translate-x-1',
                            ].join(' ')} />
                          </div>
                        </button>
                      </div>

                      {/* Donor Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard
                          label="Blood Group"
                          value={donorData.bloodGroup}
                          valueClass="text-red-600 font-bold text-2xl"
                          bg="bg-red-50"
                        />
                        <StatCard
                          label="Total Donations"
                          value={donorData.donationsCount}
                          bg="bg-blue-50"
                          valueClass="text-blue-600 font-bold text-2xl"
                        />
                        <StatCard
                          label="Last Donated"
                          value={formatDate(donorData.lastDonationDate)}
                          bg="bg-gray-50"
                          valueClass="text-gray-700 font-semibold text-sm"
                        />
                        <StatCard
                          label="Location"
                          value={donorData.location}
                          bg="bg-green-50"
                          valueClass="text-green-700 font-semibold text-sm"
                        />
                      </div>

                      {/* View Profile Button */}
                      <Button
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={() =>
                          navigate(`/donor/${donorData.id}`)
                        }
                        leftIcon={<Eye size={16} />}
                      >
                        View Public Donor Profile
                      </Button>

                    </div>
                  ) : currentUser?.donorStatus === 'pending' ? (
                    <div className="text-center py-8 bg-yellow-50/30 rounded-2xl border border-yellow-100 p-6">
                      <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                        <Clock size={28} className="text-yellow-600 animate-pulse" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Donor Profile Pending Approval
                      </h4>
                      <p className="text-sm text-gray-500 mb-0 max-w-xs mx-auto leading-relaxed">
                        Your application to become a blood donor has been submitted successfully and is currently under review by our administrators.
                      </p>
                    </div>
                  ) : currentUser?.donorStatus === 'rejected' ? (
                    <div className="text-center py-8 bg-red-50/30 rounded-2xl border border-red-100 p-6">
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <XCircle size={28} className="text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Donor Profile Rejected
                      </h4>
                      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
                        Your application was rejected by the admin. You can submit a new application with updated details.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={async () => {
                          try {
                            await updateProfile({ donorId: null, donorStatus: null })
                            showSuccess('State reset. You can now re-apply.')
                          } catch (err) {
                            showError('Failed to reset application state.')
                          }
                        }}
                      >
                        Re-apply Now
                      </Button>
                    </div>
                  ) : (
                    /* Not A Donor Yet */
                    <div className="text-center py-8">
                      <div className={[
                        'w-16 h-16 rounded-full bg-red-50',
                        'flex items-center justify-center',
                        'mx-auto mb-4',
                      ].join(' ')}>
                        <Droplets size={28} className="text-red-400" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        Not registered as a donor
                      </h4>
                      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                        Register as a blood donor and help save lives
                        in your community.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/register-donor')}
                        leftIcon={<Droplets size={16} />}
                      >
                        Become a Donor
                      </Button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────── */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        itemName="your account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />

    </div>
  )
}

export default ProfilePage

// ════════════════════════════════════════════════════
//  HELPER COMPONENTS
// ════════════════════════════════════════════════════

const QuickInfoRow = ({ icon, value }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-gray-400 flex-shrink-0">{icon}</span>
    <span className="text-sm text-gray-600 truncate">{value}</span>
  </div>
)

const ProfileInfoRow = ({ icon, label, value, valueClass = '' }) => (
  <div className={[
    'flex items-center gap-4 py-3',
    'border-b border-gray-50 last:border-0',
  ].join(' ')}>
    <span className="text-gray-400 flex-shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={[
        'text-sm font-medium text-gray-800 truncate',
        valueClass,
      ].join(' ')}>
        {value}
      </p>
    </div>
  </div>
)

const StatCard = ({ label, value, bg, valueClass }) => (
  <div className={[
    'p-4 rounded-xl',
    bg,
  ].join(' ')}>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={valueClass}>{value}</p>
  </div>
)