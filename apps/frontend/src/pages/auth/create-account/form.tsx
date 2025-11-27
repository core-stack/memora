"use client"

import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Link } from '@/components/ui/link';
import { Separator } from '@/components/ui/separator';
import { createAccountDtoSchema, useApiAuthCreateAccount, useApiAuthProviders } from '@/gen';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Oauth2Providers } from '../components/oauth-providers';

const formDto = createAccountDtoSchema.extend({
  confirmPassword: createAccountDtoSchema.shape.password
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
    });
  }
})

export function CreateAccountForm() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formDto),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { data: providers = [] } = useApiAuthProviders();
  const isLoading = form.formState.isSubmitting;
  const { mutate } = useApiAuthCreateAccount();
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Account created",
          description: "Check your email to confirm your account",
        })
      },
      onError: (error) => {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive",
        })
      }
    });
  })

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            name='name'
            label="Name"
            placeholder="John Doe"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <FormInput
            name='email'
            label="Email"
            placeholder="email@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
          />
          <FormInput
            name='password'
            label="Password"
            placeholder="Password"
            type="password"
            />
          <FormInput
            name='confirmPassword'
            placeholder="Confirm Password"
            label="Confirm Password"
            type="password"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>Create account</Button>
        </form>
      </Form>
      {
        providers.length > 0 &&
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      }
      <Oauth2Providers disableButtons={isLoading} />
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </div>
  )
}
