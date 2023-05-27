import './globals.css'
import AuthContext from './context/AuthContext'
import ActiveStatus from './messenger/components/ActiveStatus'
import ToasterContext from './context/ToasterContext'

export const metadata = {
  title: 'SkyneticMessenger',
  description: 'SkyneticMessenger is a cutting-edge communication platform, revolutionizing global connectivity with its innovative features, seamless interface, and advanced security, offering instant messaging, voice and video calls, file sharing, and customizable options for individuals of all backgrounds to stay connected, collaborate effortlessly, and experience the future of messaging',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
