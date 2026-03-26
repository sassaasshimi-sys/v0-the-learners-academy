import type { User, UserRole, AuthSession, LoginCredentials, RegisterData } from './types/auth'

// Mock user database
const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@learnersacademy.com',
    password: 'AdminSecure2026!',
    name: 'Academy Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'teacher-1',
    email: 'sarah.mitchell@gmail.com',
    password: 'TeacherAccess1!',
    name: 'Sarah Mitchell',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'teacher-2',
    email: 'david.chen@google.com',
    password: 'TeacherAccess2!',
    name: 'David Chen',
    role: 'teacher',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-1',
    email: 'student@yahoo.com',
    password: 'StudentAccess!',
    name: 'John Doe',
    role: 'student',
    createdAt: new Date().toISOString(),
  }
]

// Generate a mock JWT-like token
function generateMockToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

// Mock login function
export async function mockLogin(credentials: LoginCredentials): Promise<AuthSession> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Find user by exact email, role, and password
  const matchedUser = mockUsers.find(
    u => u.email === credentials.email && u.role === credentials.role && u.password === credentials.password
  )

  if (!matchedUser) {
    throw new Error('Invalid credentials or role mismatch. Access denied.')
  }

  const token = generateMockToken(matchedUser)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  return {
    user: matchedUser,
    token,
    expiresAt,
  }
}

// Mock register function
export async function mockRegister(data: RegisterData): Promise<AuthSession> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === data.email)
  if (existingUser) {
    throw new Error('Email already registered')
  }

  // Create new user
  const newUser: User = {
    id: `${data.role}-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString(),
  }

  // In a real app, this would save to database
  mockUsers.push(newUser)

  const token = generateMockToken(newUser)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  return {
    user: newUser,
    token,
    expiresAt,
  }
}

// Mock logout function
export async function mockLogout(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
}

// Validate token and return user
export function validateToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token))
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null
    }

    // Find user
    const user = mockUsers.find(u => u.id === payload.sub)
    return user || null
  } catch {
    return null
  }
}

// Get role-specific redirect path
export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'teacher':
      return '/teacher'
    case 'student':
      return '/student'
    default:
      return '/auth/login'
  }
}

// Check if user has access to a specific portal
export function hasPortalAccess(userRole: UserRole, portal: UserRole): boolean {
  // Users can only access their own portal
  return userRole === portal
}
