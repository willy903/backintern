import { useState } from "react";
import { UserPlus, Building2, ArrowLeft, Mail, Lock } from "lucide-react";
import { authService } from "../services/authService";
import { useApiError } from "../hooks/useApiError";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [step, setStep] = useState<"email" | "details">("email");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { error, isLoading, handleApiCall, clearError, setError } = useApiError();
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const { signIn } = useAuth();

  // ✅ Étape 1 : vérifier l’email
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !email.includes("@")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    await handleApiCall(
      () => authService.checkEmail(email),
      (response) => {
        const message = response.message;
        setEmailStatus(message);

        if (response.exists && response.hasPassword) {
          setError("Votre compte est déjà activé. Redirection vers la page de connexion...");
          setTimeout(() => (window.location.href = "/"), 2000);
        } else if (response.exists && !response.hasPassword) {
          setStep("details");
        } else {
          setError("Aucun compte associé à cet email. Contactez votre supérieur pour créer un compte.");
        }
      },
      (err) => {
        setError(err?.message || "Impossible de contacter le serveur. Vérifiez votre connexion.");
      }
    );
  };

  // ✅ Étape 2 : créer le compte uniquement si email validé
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    await handleApiCall(
      () =>
        authService.createPassword({
          email,
          password: formData.password,
        }),
      async () => {
        setSuccess(true);
        try {
          await signIn(email, formData.password);
        } catch (err) {
          console.error('Erreur de connexion automatique:', err);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      }
    );
  };

  const handleBack = () => {
    setStep("email");
    clearError();
    setEmailStatus(null);
  };

  // ✅ Écran de succès
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-12 border border-gray-100 dark:border-gray-800 w-full max-w-lg text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Compte créé avec succès
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-12 border border-gray-100 dark:border-gray-800 w-full max-w-lg">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Créer un compte</h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {step === "email" ? "Commencez par votre email" : "Définissez votre mot de passe"}
            </p>
          </div>
        </div>

        {step === "email" ? (
          <form onSubmit={handleCheckEmail} className="space-y-7">
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <Mail className="inline w-5 h-5 mr-2" />
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="utilisateur@company.com"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-base text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Vérification..." : "Continuer"}
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 mt-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-lg font-semibold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à la connexion
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <Lock className="inline w-4 h-4 mr-1" />
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {formData.password !== formData.confirmPassword &&
              formData.confirmPassword && (
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Les mots de passe ne correspondent pas
                  </p>
                </div>
              )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={
                  isLoading || formData.password !== formData.confirmPassword
                }
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-6 h-6" />
                {isLoading ? "Création..." : "Créer mon compte"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-lg font-semibold transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
