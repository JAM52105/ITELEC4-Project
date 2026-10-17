import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { login as loginRequest, register as registerRequest } from "../api/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await registerRequest({ name, email, password });
      }
      const result = await loginRequest(email, password);
      login(result.token, result.userName);
      navigate("/submissions");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegistering && (
          <div>
            <Label htmlFor="name" className="mb-1">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
            />
          </div>
        )}
        <div>
          <Label htmlFor="email" className="mb-1">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={isRegistering ? 8 : 1}
            maxLength={72}
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-3">
          {isSubmitting ? "Please wait..." : isRegistering ? "Register and Log In" : "Log In"}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => {
          setIsRegistering((current) => !current);
          setError(null);
        }}
        className="mt-3 text-sm text-blue-700 underline"
      >
        {isRegistering ? "Already registered? Log in" : "Need an account? Register"}
      </button>
    </div>
  );
}

export default LoginPage;
