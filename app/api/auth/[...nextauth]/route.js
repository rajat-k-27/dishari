import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Login attempt for:', credentials?.email);
          await dbConnect();

          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            console.log('❌ User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('✅ User found:', user.email, '| Role:', user.role, '| Active:', user.active);

          if (!user.active) {
            console.log('❌ Account is deactivated');
            throw new Error('Account is deactivated');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          console.log('🔑 Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ Invalid password for:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('✅ Login successful for:', user.email);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('❌ Auth error:', error.message);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
