import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/context/session-context";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CornerDownRight,
  Eye,
  EyeOff,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  name: z
    .string()
    .nonempty()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(20, { message: "Name must have at most 20 characters" }),
  email: z.string().email({ message: "Enter a valid email" }).nonempty(),
  password: z
    .string()
    .nonempty()
    .min(6, { message: "Password must have at least 6 characters" }),
});

const SignUp = () => {
  const { session, SignUp } = useSession();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<any>();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session) {
      navigate("/");
    }
    inputRef.current.focus();
  }, [session, navigate]);

  async function onSubmit(userInfo: z.infer<typeof loginSchema>) {
    const { name, email, password } = userInfo;

    try {
      await SignUp(name, email, password);
      navigate("/");
    } catch (error: any) {
      loginForm.setError("root", {
        message: error.message || "Sign up failed",
      });
    }
  }

  return (
    <div className="min-h-screen py-28">
      <div className="flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center animate-fade-in-up">
            <p className="text-gray-600 text-lg">Join Maalelo today!</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all hover:shadow-2xl">
            <Form {...loginForm}>
              <div className="pb-3 text-2xl font-light">Sign Up</div>
              <hr />
              <form
                onSubmit={loginForm.handleSubmit(onSubmit)}
                className="space-y-6 pt-3"
              >
                {loginForm.formState.errors.root && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    ⚠️ {loginForm.formState.errors.root.message}
                  </div>
                )}

                <FormField
                  control={loginForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="signup-name"
                        className="text-gray-700"
                      >
                        Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="signup-name"
                            placeholder="Your Name"
                            {...field}
                            className="pl-10 py-5 rounded-lg"
                            ref={inputRef}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="signup-email"
                        className="text-gray-700"
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="signup-email"
                            placeholder="hello@example.com"
                            {...field}
                            className="pl-10 py-5 rounded-lg"
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="signup-password"
                        className="text-gray-700"
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center justify-between">
                          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pl-10 py-5 rounded-lg"
                            autoComplete="new-password"
                          />
                          <div
                            className="p-2 border rounded-lg ml-1 bg-gray-100 hover:cursor-pointer hover:bg-gray-200"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </div>
                        </div>
                      </FormControl>

                      <FormMessage className="text-red-500"></FormMessage>
                    </FormItem>
                  )}
                />
                {/* <Button variant={"indigo"}>Fill Random Info for testing</Button> */}
                <Button
                  type="submit"
                  className="w-full py-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg"
                  disabled={loginForm.formState.isSubmitting}
                >
                  <span className="text-lg font-semibold text-white mr-2">
                    {loginForm.formState.isSubmitting ? (
                      <Loader2Icon className="h-5 w-5 animate-spin" />
                    ) : (
                      "Sign Up"
                    )}
                  </span>
                  <CornerDownRight className="h-5 w-5 text-white" />
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors underline underline-offset-4 hover:decoration-2"
            >
              Login
            </button>
            <br />
            <br />
            <button
              onClick={() => navigate("/seller/signup")}
              className="inline-flex items-center gap-2 rounded-2xl border border-gold-200 bg-gold-100 px-4 py-2 text-sm font-semibold text-gold-900 hover:bg-gold-200 hover:text-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              Become a Seller Today!
              <ArrowUpRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
