import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Logo from '../../assets/Logo.png';

type ProfileSummaryState = {
  username?: string;
  bio?: string;
  profileImage?: string | null;
  details?: string;
};

type ProfileSummaryData = {
  username: string;
  bio: string;
  details: string;
  profileImage: string | null;
};

export default function ProfileSummary(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as ProfileSummaryState | null) ?? undefined;

  const [profileData, setProfileData] = useState<ProfileSummaryData | null>(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('raynUsername');
    const storedBio = sessionStorage.getItem('raynProfileBio');
    const storedDetails = sessionStorage.getItem('raynProfileDetails');
    const storedProfileImage = sessionStorage.getItem('raynProfileImage');

    const resolvedUsername = locationState?.username ?? storedUsername ?? '';

    if (!resolvedUsername) {
      navigate('/choose-username');
      return;
    }

    const resolvedBio = locationState?.bio ?? storedBio ?? '';
    const resolvedDetails = locationState?.details ?? storedDetails ?? '';
    const resolvedProfileImage = locationState?.profileImage ?? storedProfileImage ?? null;

    sessionStorage.setItem('raynUsername', resolvedUsername);
    sessionStorage.setItem('raynProfileBio', resolvedBio);
    sessionStorage.setItem('raynProfileDetails', resolvedDetails);

    if (resolvedProfileImage) {
      sessionStorage.setItem('raynProfileImage', resolvedProfileImage);
    }

    setProfileData({
      username: resolvedUsername,
      bio: resolvedBio,
      details: resolvedDetails,
      profileImage: resolvedProfileImage,
    });
  }, [locationState, navigate]);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const handleEditProfile = (): void => {
    navigate('/profile', {
      state: {
        username: profileData.username,
        bio: profileData.bio,
        details: profileData.details,
        profileImage: profileData.profileImage,
      },
    });
  };

  const handleGoToDashboard = (): void => {
    navigate('/dashboard', {
      state: {
        username: profileData.username,
        profileImage: profileData.profileImage,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/40 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap- sm:gap-">
            <img src={Logo} alt="Rayn logo" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
            <span className="text-xl sm:text-2xl font-semibold">Rayn</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleEditProfile}
              className="text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors"
            >
              Edit profile
            </button>
            <button
              onClick={handleGoToDashboard}
              className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
            >
              View dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl shadow-2xl backdrop-blur">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 sm:p-8">
              <div className="flex flex-col items-center lg:items-start gap-4 lg:w-1/3">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-purple-600/60 bg-gray-800/60 flex items-center justify-center overflow-hidden">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 text-sm sm:text-base">
                      @{profileData.username}
                    </span>
                  )}
                </div>
                
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">@{profileData.username}</h1>
                  <p className="text-gray-400 text-sm sm:text-base">
                    This is your Rayn profile. Keep your details up to date so people know who you are.
                  </p>
                </div>

                <div className="bg-gray-900/60 border border-gray-800/70 rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">About you</h2>
                  <p className={`text-sm sm:text-base ${profileData.bio ? 'text-gray-200' : 'text-gray-500 italic'}`}>
                    {profileData.bio || 'No bio added yet.'}
                  </p>
                </div>

                <div className="bg-gray-900/60 border border-gray-800/70 rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">Additional details</h2>
                  <p className={`text-sm sm:text-base ${profileData.details ? 'text-gray-200' : 'text-gray-500 italic'}`}>
                    {profileData.details || 'No additional details provided.'}
                  </p>
                </div>

                <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">Account snapshot</h2>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                    <li className="flex items-center justify-between">
                      <span>Username</span>
                      <span className="font-medium">@{profileData.username}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Profile image</span>
                      <span className="font-medium">{profileData.profileImage ? 'Uploaded' : 'Not set'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Bio</span>
                      <span className="font-medium">{profileData.bio ? 'Completed' : 'Missing'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Additional details</span>
                      <span className="font-medium">{profileData.details ? 'Provided' : 'Missing'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleGoToDashboard}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
                  >
                    Proceed to dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
