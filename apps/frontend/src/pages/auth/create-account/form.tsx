"use client"

import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { createAccountSchema, type CreateAccountSchema } from '@snipet/schemas';
import { zodResolver } from '@/utils/zod-resolver';
import { Link } from '@/components/ui/link';

export function CreateAccountForm() {
  const { toast } = useToast();
  const form = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const { mutate } = useApiMutation("/api/auth/create-account");
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ body: data }, {
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
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </div>
  )
}
