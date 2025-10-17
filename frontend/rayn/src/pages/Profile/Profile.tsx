import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Logo from '../../assets/Logo.png';

type ProfileLocationState = {
  username?: string;
  bio?: string;
  profileImage?: string | null;
  details?: string;
  profileImageName?: string | null;
};

export default function Profile(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as ProfileLocationState | null) ?? undefined;

  const [username, setUsername] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const stateUsername = locationState?.username;
    const stateBio = locationState?.bio;
    const stateProfileImage = locationState?.profileImage;
    const stateDetails = locationState?.details;
    const stateProfileImageName = locationState?.profileImageName;

    const storedUsername = sessionStorage.getItem('raynUsername');
    const storedBio = sessionStorage.getItem('raynProfileBio');
    const storedDetails = sessionStorage.getItem('raynProfileDetails');
    const resolvedUsername = stateUsername ?? storedUsername ?? '';

    if (!resolvedUsername) {
      navigate('/choose-username');
      return;
    }

    setUsername(resolvedUsername);
    sessionStorage.setItem('raynUsername', resolvedUsername);

    if (stateBio !== undefined) {
      setBio(stateBio);
      sessionStorage.setItem('raynProfileBio', stateBio);
    } else {
      if (storedBio !== null) {
        setBio(storedBio);
      }
    }

    if (stateDetails !== undefined) {
      setDetails(stateDetails);
      sessionStorage.setItem('raynProfileDetails', stateDetails);
    } else if (storedDetails !== null) {
      setDetails(storedDetails);
    }

    if (stateProfileImage !== undefined) {
      if (stateProfileImage) {
        setProfileImage(stateProfileImage);
        sessionStorage.setItem('raynProfileImage', stateProfileImage);
      } else {
        setProfileImage(null);
        setSelectedFileName('');
        sessionStorage.removeItem('raynProfileImage');
        sessionStorage.removeItem('raynProfileImageName');
      }
    } else {
      const storedProfileImage = sessionStorage.getItem('raynProfileImage');

      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      }
    }

    if (stateProfileImageName !== undefined) {
      const nextFileName = stateProfileImageName ?? '';
      setSelectedFileName(nextFileName);

      if (nextFileName) {
        sessionStorage.setItem('raynProfileImageName', nextFileName);
      } else {
        sessionStorage.removeItem('raynProfileImageName');
      }
    } else {
      const storedProfileImageName = sessionStorage.getItem('raynProfileImageName');

      if (storedProfileImageName !== null) {
        setSelectedFileName(storedProfileImageName);
      }
    }
  }, [locationState, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(typeof reader.result === 'string' ? reader.result : null);

      if (typeof reader.result === 'string') {
        sessionStorage.setItem('raynProfileImage', reader.result);
      }
    };

    reader.readAsDataURL(file);
    setSelectedFileName(file.name);
    sessionStorage.setItem('raynProfileImageName', file.name);
  };

  const handleRemoveImage = (): void => {
    setProfileImage(null);
    setSelectedFileName('');
    sessionStorage.removeItem('raynProfileImage');
    sessionStorage.removeItem('raynProfileImageName');
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setBio(event.target.value);
  };

  const handleDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setDetails(event.target.value);
  };

  const handleSaveProfile = (): void => {
    sessionStorage.setItem('raynUsername', username);
    sessionStorage.setItem('raynProfileBio', bio);
    sessionStorage.setItem('raynProfileDetails', details);

    if (profileImage) {
      sessionStorage.setItem('raynProfileImage', profileImage);
    } else {
      sessionStorage.removeItem('raynProfileImage');
    }

    if (selectedFileName) {
      sessionStorage.setItem('raynProfileImageName', selectedFileName);
    } else {
      sessionStorage.removeItem('raynProfileImageName');
    }

    navigate('/profile-summary', {
      state: {
        username,
        bio,
        profileImage,
        details,
        profileImageName: selectedFileName || null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/40 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={Logo} alt="Rayn logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="text-xl sm:text-2xl font-semibold">Rayn</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors"
          >
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-xl bg-gray-900/40 border border-gray-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Welcome{username ? `, @${username}` : ''}</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Upload a profile picture to complete your Rayn profile.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-purple-600/60 bg-gray-800/60 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-sm sm:text-base">
                    {username ? `@${username}` : 'Avatar'}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full text-center">
              <label
                htmlFor="profile-upload"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all text-sm sm:text-base font-semibold cursor-pointer"
              >
                Upload image
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {selectedFileName && (
                <div className="mt-3 text-xs sm:text-sm text-gray-400">
                  <p>{selectedFileName}</p>
                  <button
                    onClick={handleRemoveImage}
                    className="mt-2 text-purple-400 hover:text-purple-300"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="profile-bio" className="block text-left text-sm sm:text-base font-medium text-gray-300 mb-2">
                Tell us about yourself
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={handleBioChange}
                placeholder="Describe who you are or what you do"
                className="w-full min-h-[120px] resize-none rounded-2xl bg-gray-900/60 border border-gray-800/70 focus:border-purple-600 focus:outline-none px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500"
              />
            </div>

            <div className="w-full">
              <label htmlFor="profile-details" className="block text-left text-sm sm:text-base font-medium text-gray-300 mb-2">
                Additional details
              </label>
              <textarea
                id="profile-details"
                value={details}
                onChange={handleDetailsChange}
                placeholder="Share anything else you'd like people to know"
                className="w-full min-h-[100px] resize-none rounded-2xl bg-gray-900/60 border border-gray-800/70 focus:border-purple-600 focus:outline-none px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="w-full max-w-sm mt-4 bg-purple-600/80 hover:bg-purple-600 text-white font-semibold py-3 rounded-full transition-colors"
            >
              Save profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
