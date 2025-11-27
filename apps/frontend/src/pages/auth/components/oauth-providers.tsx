import { Button } from "@/components/ui/button";
import { useApiAuthOauth2, useApiAuthProviders } from "@/gen";
import { capitalizeFirstLetter } from "@/lib/string";
import { cn } from "@/lib/utils";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const providerIconMap = {
  google: FcGoogle,
  facebook: FaFacebook
}

type Props = {
  disableButtons?: boolean;
}
export const Oauth2Providers = ({ disableButtons }: Props) => {
  const { data: providers = [] } = useApiAuthProviders();
  const { mutate: mutateOauth } = useApiAuthOauth2();

  const handleOauth2 = (provider: string) => mutateOauth(
    { provider }, { onSuccess: ({ url }) => window.location.href = url }
  );

  const getProviderIcon = (provider: keyof typeof providerIconMap) => {
    const Icon = providerIconMap[provider];
    return <Icon className="mr-2 h-4 w-4" />;
  };

  return (
    <div className="flex justify-center gap-4">
      {providers.map(provider => (
        <Button
          variant="outline"
          type="button"
          className={cn(providers.length === 1 && 'w-full')}
          isLoading={disableButtons}
          onClick={() => handleOauth2(provider)}
        >
          {getProviderIcon(provider as keyof typeof providerIconMap)}
          {capitalizeFirstLetter(provider)}
        </Button>
      ))}
    </div>
  );
}