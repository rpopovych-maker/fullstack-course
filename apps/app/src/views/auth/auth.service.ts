import { supabase } from '@/features/platform/supabase/supabase.client'

class AuthService {
  getUser (): Promise<TUser | null> {
    return apiClient.get('/api/me/')
  }

  async signUp (email: string, password: string, username: string) {
    return await apiClient.post('/api/sign-up/', {
      email,
      password,
      username
    })
  }

  async signIn (email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    return data
  }

  async signOut () {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  async resetPassword (email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw error
    }

    return data
  }

  async updatePassword (newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw error
    }

    return data
  }
}

export const authService = new AuthService()
