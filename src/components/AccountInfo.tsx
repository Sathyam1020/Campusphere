'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccountType } from '@/hooks/use-account-type';
import { Mail, RefreshCw, User } from 'lucide-react';

export function AccountInfo() {
    const { accountType, userId, email, isLoading, error, refetch } = useAccountType();

    if (isLoading) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Loading account information...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-md border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <Button onClick={refetch} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Account Information</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Type:</span>
                    <Badge variant={accountType === 'STUDENT' ? 'default' : 'secondary'}>
                        {accountType}
                    </Badge>
                </div>

                <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{email}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                    User ID: {userId}
                </div>

                <Button onClick={refetch} variant="outline" size="sm" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </CardContent>
        </Card>
    );
}