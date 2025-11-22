import { useMember } from '@/integrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { member } = useMember();
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (firstName?: string, lastName?: string, nickname?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (nickname) {
      return nickname.charAt(0).toUpperCase();
    }
    if (member?.loginEmail) {
      return member.loginEmail.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserRole = () => {
    // In a real app, this would come from your user management system
    // For now, we'll show a default role
    return 'Manager';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            Profile Settings
          </h1>
          <p className="font-paragraph text-secondary-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <Card className="lg:col-span-1 bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-8 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-6">
                <AvatarImage 
                  src={member?.profile?.photo?.url} 
                  alt="Profile photo" 
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(
                    member?.contact?.firstName,
                    member?.contact?.lastName,
                    member?.profile?.nickname
                  )}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="font-heading text-xl font-semibold text-primary mb-2">
                {member?.profile?.nickname || 
                 `${member?.contact?.firstName || ''} ${member?.contact?.lastName || ''}`.trim() ||
                 'User'}
              </h2>
              
              <p className="font-paragraph text-secondary-foreground mb-4">
                {member?.loginEmail}
              </p>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Shield className="h-4 w-4 mr-2" />
                <span className="font-paragraph text-sm font-medium">
                  {getUserRole()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="font-heading text-xl font-semibold text-primary">
                  Account Information
                </CardTitle>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-paragraph text-secondary-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={member?.contact?.firstName || ''}
                    disabled={!isEditing}
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-paragraph text-secondary-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={member?.contact?.lastName || ''}
                    disabled={!isEditing}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="font-paragraph text-secondary-foreground">
                  Display Name
                </Label>
                <Input
                  id="nickname"
                  value={member?.profile?.nickname || ''}
                  disabled={!isEditing}
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-paragraph text-secondary-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={member?.loginEmail || ''}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>

              {member?.contact?.phones && member.contact.phones.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-paragraph text-secondary-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={member.contact.phones[0]}
                    disabled={!isEditing}
                    className="bg-gray-50"
                  />
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In a real app, you would save the changes here
                      setIsEditing(false);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground">
                    Member Since
                  </p>
                  <p className="font-heading text-lg font-semibold text-primary">
                    {member?._createdDate ? 
                      format(new Date(member._createdDate), 'MMM yyyy') : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground">
                    Last Login
                  </p>
                  <p className="font-heading text-lg font-semibold text-primary">
                    {member?.lastLoginDate ? 
                      format(new Date(member.lastLoginDate), 'MMM dd, yyyy') : 
                      'Today'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground">
                    Account Status
                  </p>
                  <p className="font-heading text-lg font-semibold text-primary">
                    {member?.status === 'APPROVED' ? 'Active' : member?.status || 'Active'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}