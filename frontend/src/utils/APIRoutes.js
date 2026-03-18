const host = "http://localhost:8080";

const APIRoutes = {
  host,
  login: `${host}/auth/login`,
  register: `${host}/auth/register`,
  authCheck: `${host}/auth-check`,
  googleLogin: `${host}/auth/google-login`,
  forgotPassword: `${host}/auth/forgot-password`,
  resetPassword: `${host}/auth/reset-password`,
  chiefWardenRegister: `${host}/auth/chief-warden-register`,
  logout: `${host}/auth/logout`,

  addAccountant: `${host}/chief-warden/add-accountant`,
  getSignature: `${host}/chief-warden/get-signature`,
  resolveComplaint: `${host}/chief-warden/resolve-complaint`,
  
  uploadNotice: `${host}/chief-warden-accountant/upload-notice`,
  changeMenu: `${host}/chief-warden-accountant/change-menu`,
  getHostelNameAndCode: `${host}/chief-warden-accountant/get-hostel-name-and-code`,

  addExpense: `${host}/accountant/add-expense`,
  
  messMenu: `${host}/general/mess-menu`,
  getNotices: `${host}/general/get-notices`,
  getPendingComplaints: `${host}/general/get-pending-complaints`,
  getResolvedComplaints: `${host}/general/get-resolved-complaints`,
  getAverageRating: `${host}/general/get-average-rating`,
  getWeeklyRatings: `${host}/general/get-weekly-ratings`,
  getHostelName: `${host}/general/get-hostel-name`,
  uploadProfileImage: `${host}/general/upload-profile-image`,
  dailyExpense: `${host}/general/daily-expense`,
  monthlyExpense: `${host}/general/monthly-expense`,
  
  joinHostel: `${host}/student/join-hostel`,
  raiseComplaint: `${host}/student/raise-complaint`,
  likeComplaint: `${host}/student/like-complaint`,
  dislikeComplaint: `${host}/student/dislike-complaint`,
  submitRating: `${host}/student/submit-rating`,
  leaveHostel: `${host}/student/leave-hostel`,
};

export default APIRoutes;