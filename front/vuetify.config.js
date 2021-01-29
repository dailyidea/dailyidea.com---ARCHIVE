import UserIcon from '@/components/icons/UserIcon'
import MailIcon from '@/components/icons/MailIcon'

export default {
  icons: {
    iconfont: 'md',
    values: {
      user: {
        component: UserIcon
      },
      mail: {
        component: MailIcon
      }
    }
  },
  theme: {
    themes: {
      light: {
        primary: '#5B41BB',
        accent: '#FFFFFF',
        secondary: '#ffc61e',
        info: '#35124e',
        warning: '#ffb300',
        error: '#DD4040',
        success: '#2E7D32'
      },
      dark: {
        primary: '#5B41BB',
        accent: '#FFFFFF',
        secondary: '#ffc61e',
        info: '#35124e',
        warning: '#ffb300',
        error: '#B71C1C',
        success: '#2E7D32'
      }
    }
  },
  treeShake: true,
  options: {
    customProperties: true
  }
}
