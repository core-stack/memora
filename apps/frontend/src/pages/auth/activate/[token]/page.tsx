import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useParams } from '@/hooks/use-params';

export function ActivateAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams<{ token?: string }>();
  const errorMessage = useRef<string | null>(token ? null : "Invalid activation code");
  const { mutate: activeAccount } = useApiMutation("/api/auth/active-account", { method: "POST" });

  useEffect(() => {
    if (!errorMessage.current && token) {
      activeAccount({ body: { token } }, {
        onSuccess: ()  => setIsLoading(false),
        onError: (error) => {
          console.log("error", error);
          setIsLoading(false);
          errorMessage.current = error.message ?? "Invalid activation code"
        }, 
      })
    }
  }, [activeAccount, token]);

  const getDescription = () => {
    if (isLoading) return "Wait a moment!";
    else {
      if (errorMessage.current) return "Error activating account!";
      else return "Account Activated!";
    }
  }
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-linear-to-b from-background/50 to-background">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border/40 shadow-xl">
          <CardHeader>
            <CardTitle className='text-center'>Account Activation</CardTitle>
            <CardDescription className='text-center'>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            { isLoading && <ActivationLoading /> }
            { !isLoading && (errorMessage.current ? <ActivationError error={errorMessage.current} /> : <ActivationSuccess />) }
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const ActivationLoading = () => {
  return (
    <div className="text-center py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-secondary dark:bg-secondary/30 animate-ping opacity-75 scale-110"></div>
          <div className="relative rounded-full p-4 bg-secondary dark:bg-secondary/30">
            <Spinner variant="secondary" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Activating account!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We are activating your account...
        </p>
      </div>
    </div>
  )
}


const ActivationSuccess = () => {
  return (
    <div className="text-center py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-ping opacity-75 scale-110"></div>
          <div className="relative rounded-full p-4 bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-500" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Account Activated!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your account has been activated successfully!
        </p>
      </div>
      <Button asChild size="lg" className="mt-4 px-8 font-medium">
        <Link href="/login" className="flex items-center">
          Continue to Login <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

const ActivationError = ({ error }: { error: string }) => {
  return (
    <div className="text-center py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center">
        <div className="relative">
          <div className="relative rounded-full p-4 bg-destructive/20">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Failed to Activate Account</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">{error}</p>
      </div>
      <Button asChild variant="outline" size="lg" className="mt-4 px-8 font-medium">
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  )
}
