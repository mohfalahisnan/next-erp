'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await signIn.email({
				email,
				password,
			});
			setSuccess('Successfully signed in! Redirecting...');

			// Redirect to dashboard after successful sign-in
			setTimeout(() => {
				router.push('/dashboard');
			}, 1500);
		} catch (error: any) {
			console.error('Sign in error:', error);

			// Extract meaningful error messages
			let errorMessage =
				'An unexpected error occurred. Please try again.';

			if (error?.message) {
				if (
					error.message.includes('Invalid credentials') ||
					error.message.includes('invalid_credentials')
				) {
					errorMessage =
						'Invalid email or password. Please check your credentials and try again.';
				} else if (
					error.message.includes('User not found') ||
					error.message.includes('user_not_found')
				) {
					errorMessage =
						'No account found with this email address. Please sign up first.';
				} else if (
					error.message.includes('Email not verified') ||
					error.message.includes('email_not_verified')
				) {
					errorMessage =
						'Please verify your email address before signing in.';
				} else if (
					error.message.includes('Too many requests') ||
					error.message.includes('rate_limit')
				) {
					errorMessage =
						'Too many sign-in attempts. Please wait a few minutes before trying again.';
				} else if (
					error.message.includes('Network') ||
					error.message.includes('fetch')
				) {
					errorMessage =
						'Network error. Please check your internet connection and try again.';
				} else {
					errorMessage = error.message;
				}
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await signUp.email({
				email,
				password,
				name,
			});
			setSuccess(
				'Account created successfully! Please check your email for verification.'
			);
			// Clear form on successful signup
			setEmail('');
			setPassword('');
			setName('');
		} catch (error: any) {
			console.error('Sign up error:', error);

			// Extract meaningful error messages
			let errorMessage =
				'An unexpected error occurred. Please try again.';

			if (error?.message) {
				if (
					error.message.includes('User already exists') ||
					error.message.includes('user_exists')
				) {
					errorMessage =
						'An account with this email already exists. Please sign in instead.';
				} else if (
					error.message.includes('Invalid email') ||
					error.message.includes('invalid_email')
				) {
					errorMessage = 'Please enter a valid email address.';
				} else if (
					error.message.includes('Password too weak') ||
					error.message.includes('weak_password')
				) {
					errorMessage =
						'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.';
				} else if (
					error.message.includes('Invalid name') ||
					error.message.includes('invalid_name')
				) {
					errorMessage =
						'Please enter a valid name (at least 2 characters).';
				} else if (
					error.message.includes('Network') ||
					error.message.includes('fetch')
				) {
					errorMessage =
						'Network error. Please check your internet connection and try again.';
				} else {
					errorMessage = error.message;
				}
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle>Welcome to ERP Dashboard</CardTitle>
				<CardDescription>
					Sign in to your account or create a new one
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Error Alert */}
				{error && (
					<Alert variant='destructive' className='mb-4'>
						<AlertCircle className='h-4 w-4' />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Success Alert */}
				{success && (
					<Alert variant={'default'} className='mb-4'>
						<CheckCircle className='h-4 w-4' />
						<AlertDescription>{success}</AlertDescription>
					</Alert>
				)}

				<Tabs defaultValue='signin' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='signin'>Sign In</TabsTrigger>
						<TabsTrigger value='signup'>Sign Up</TabsTrigger>
					</TabsList>

					<TabsContent value='signin' className='space-y-4'>
						<form onSubmit={handleSignIn} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<Input
									id='password'
									type='password'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}
							>
								{isLoading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value='signup' className='space-y-4'>
						<form onSubmit={handleSignUp} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									type='text'
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<Input
									id='password'
									type='password'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}
							>
								{isLoading ? 'Creating account...' : 'Sign Up'}
							</Button>
						</form>
					</TabsContent>
				</Tabs>

				{/* <div className="mt-6 space-y-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
            >
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Google
            </Button>
          </div>
        </div> */}
			</CardContent>
		</Card>
	);
}
