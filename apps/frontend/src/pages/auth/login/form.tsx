"use client"

import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormError, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@/utils/zod-resolver';
import { useSearchParams } from '@/hooks/use-search-params';
import { loginSchema, type LoginSchema } from '@snipet/schemas';
import { useRouter } from '@/hooks/use-router';
import { Link } from '@/components/ui/link';

export function LoginForm() {
  const [searchParams] = useSearchParams();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      redirect: searchParams.get("redirect") ?? undefined
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const { mutate, error } = useApiMutation('/api/auth/login');
  const onSubmit = form.handleSubmit(async (body) => {
    mutate({ body }, {
      onSuccess: ({ redirect }) => {
        if (redirect) router.push(redirect);
      }
    });
  });

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput name="email" label="E-mail" type="email" />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/auth/reset-password" className="text-xs text-muted-foreground hover:text-primary">
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          { error?.message && <FormError>{error.message}</FormError> }
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Login
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" isLoading={isLoading}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" isLoading={isLoading}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/create-account" className="underline underline-offset-4 hover:text-primary">
          Create one
        </Link>
      </div>
    </div>
  )
}
