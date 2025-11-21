"use client";

import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from "react-icons/fa";

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormError, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { loginDtoSchema, useApiAuthLogin, useApiAuthProviders } from '@/gen';
import { useRouter } from '@/hooks/use-router';
import { useSearchParams } from '@/hooks/use-search-params';
import { zodResolver } from '@/utils/zod-resolver';

import type { LoginDtoSchema } from '@/gen';
import { capitalizeFirstLetter } from '@/lib/string';
const providerIconMap = {
  google: FcGoogle,
  facebook: FaFacebook
}
export function LoginForm() {
  const [searchParams] = useSearchParams();
  const form = useForm<LoginDtoSchema>({
    resolver: zodResolver(loginDtoSchema),
    defaultValues: {
      email: "",
      password: "",
      redirect: searchParams.get("redirect") ?? undefined
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const { data: providers = [] } = useApiAuthProviders();
  const { mutate, error} = useApiAuthLogin();
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ data }, {
      onSuccess: ({ redirect }) => {
        if (redirect) router.push(redirect);
      }
    });
  });

  const getProviderIcon = (provider: keyof typeof providerIconMap) => {
    const Icon = providerIconMap[provider];
    return <Icon className="mr-2 h-4 w-4" />;
  };

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
        {providers.map((provider) => (
          <Button variant="outline" type="button" isLoading={isLoading}>
            {getProviderIcon(provider as keyof typeof providerIconMap)}
            {capitalizeFirstLetter(provider)}
          </Button>
        ))}
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
