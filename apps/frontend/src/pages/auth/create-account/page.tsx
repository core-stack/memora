import { Link } from '@/components/ui/link';
import { CreateAccountForm } from './form';

export default function CreateAccountPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center flex lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Create your account to access the platform</p>
          </div>
          <CreateAccountForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our {" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
