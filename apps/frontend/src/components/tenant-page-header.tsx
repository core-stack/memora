import { Button } from './ui/button';

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    text?: string;
    action: () => void | Promise<void>;
    icon?: React.ReactNode;
  }
}

export const TenantPageHeader = ({ description, title, action, icon }: Props) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 max-sm:flex-col">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        {
          action && (
            <Button onClick={action.action} size="lg">
              {action.icon}
              {action.text}
            </Button>
          )
        }
      </div>
    </div>
  )
}