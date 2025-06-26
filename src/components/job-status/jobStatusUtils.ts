
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Brain 
} from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'processing':
      return Brain;
    case 'completed':
      return CheckCircle;
    case 'failed':
      return XCircle;
    case 'cancelled':
      return AlertCircle;
    default:
      return Clock;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
