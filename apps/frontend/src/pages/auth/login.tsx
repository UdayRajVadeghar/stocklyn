import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }).nonempty(),
  password: z
    .string()
    .nonempty()
    .min(6, { message: "password must have at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<Boolean>(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token !== undefined) {
      navigate("/");
      return;
    }
  }, []);
  ``;

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(info: z.infer<typeof loginSchema>) {
    const { email, password } = info;

    try {
      await axios.post(
        "http://localhost:5000/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  if (!session) {
    return (
      <div className="pt-28">
        <div className="flex flex-col justify-center items-center h-5/6 pt-20">
          <h1 className="text-gray-600 font-serif text-3xl p-3">Login</h1>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-4 border-black border rounded-md p-6 w-full max-w-md "
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl ">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>This is your Email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormDescription>This is your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="flex justify-center items-center bg-green-500 hover:bg-green-400"
              >
                <span className="pb-1">Log In</span>
                <LogIn />
              </Button>
            </form>
          </Form>
          <h1>
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up!
            </span>
          </h1>
        </div>
      </div>
    );
  }
};

export default Login;
