import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import  Link  from 'next/link'
import { 
  AlertTriangle, 
  ServerCrash, 
} from 'lucide-react'

interface MessageCardProps {
  status: number;
  message: string;
  className?: string;
  link: string;
  buttonMessage: string;
}

const MessageCard: React.FC<MessageCardProps> = ({ 
  status, 
  message, 
  className,
  link,
  buttonMessage
}) => {
  const getIconAndStyle = () => {
    switch (status) {
       
      case 404:
        return {
          Icon: AlertTriangle,
          iconBgClass: 'bg-yellow-500/10',
          iconClass: 'text-yellow-500',
          title: 'Not Found'
        };
      case 500:
        return {
          Icon: ServerCrash,
          iconBgClass: 'bg-red-500/10',
          iconClass: 'text-red-500',
          title: 'Error'
        };
      default:
        return {
          Icon: AlertTriangle,
          iconBgClass: 'bg-gray-500/10',
          iconClass: 'text-gray-500',
          title: 'Unknown Status'
        };
    }
  };

  const { Icon, iconBgClass, iconClass, title } = getIconAndStyle();

  // Render action based on status
  const renderAction = () => {
     
        return (
            <Link href={link}>
          <Button   >
              {buttonMessage}
          </Button>
            </Link>
        );
        
    
  };

  return (
    <Card className={className}>
      <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-6 text-center">
        <div className={`rounded-full ${iconBgClass} p-4`}>
          <Icon className={`h-10 w-10 ${iconClass}`} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {message}
          </p>
        </div>
        
        {renderAction()}
      </CardContent>
    </Card>
  )
}

export default MessageCard