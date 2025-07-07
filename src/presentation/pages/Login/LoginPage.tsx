import { useState } from "react";
import { useAuth } from "../../../app/hooks/useAuth";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const login = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Clear previous states
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.error) {
        setError(result.message || "Login failed. Please try again.");
      } else {
        setSuccess("Login successful! Redirecting to dashboard...");
        // Reset form
        localStorage.setItem("token", JSON.stringify(result.data.data));
        window.location.reload();
        setFormData({ email: "", password: "" });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-40 right-40 w-64 h-64 bg-cyan-500/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 left-40 w-56 h-56 bg-orange-500/8 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      {/* Animated Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>

              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                {/* Animated Icons */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl animate-bounce">🏠</div>
                  <div className="text-3xl">🐔</div>
                  <div className="text-3xl animate-pulse">🌡️</div>
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  Smart Chicken Farm
                </h1>
                <p className="text-gray-300 text-sm lg:text-base">
                  🚀 Advanced IoT Monitoring System
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="relative">
            {/* Form Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50"></div>

            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-3xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-300">
                  Sign in to access your dashboard
                </p>
              </div>

              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-lg rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-red-400 text-xl">❌</div>
                        <div className="text-red-300 text-sm font-medium">
                          {error}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <div className="bg-green-500/20 border border-green-500/50 backdrop-blur-lg rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-green-400 text-xl">✅</div>
                        <div className="text-green-300 text-sm font-medium">
                          {success}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <span>📧</span>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <span>🔒</span>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.email || !formData.password}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🚀</span>
                      <span>Sign In</span>
                    </div>
                  )}
                </button>

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <div className="text-white text-lg font-semibold mb-2">
                          Authenticating...
                        </div>
                        <div className="text-gray-300 text-sm">
                          Please wait while we verify your credentials
                        </div>
                        <div className="flex justify-center gap-1 mt-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Status */}
          <div className="mt-8 text-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-6">
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span className="text-sm text-green-300 font-semibold">
                    System Online
                  </span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🛡️</span>
                  <span className="text-sm text-blue-300 font-semibold">
                    Secure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
