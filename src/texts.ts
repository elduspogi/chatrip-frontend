export const landingePageContents = [
  { isTitle: true,
    text: "is a fun and spontaneous way to meet new people from all around the world. With just a click, you are instantly connected to strangers for real-time conversations — no sign-ups, no pressure. Whether you're looking for friendship, deep talks, or just someone to pass the time with, Chatrip is your go-to place for meaningful (or totally random) chats. Hop in and enjoy the trip!", isWarning: false
  },
  { isTitle: false,
    text: "If you prefer, you can add your interests to get matched with people who share similar vibes — making each chat even more enjoyable.", isWarning: false
  },
  { isTitle: false,
    text: "By using Chatrip, you accept the terms and conditions at the bottom. You must be 18+.", isWarning: true
  },
];

export const termsOfServiceContents = [
  { title: 'Elibility',
    text: 'You must be at least 18 years old (or the age of majority in your country) to use this website. If you are under 18, you may use the service only with the involvement of a parent or legal guardian.'
  },
  {
    title: 'Anonymous Chatting',
    text: 'Our platform connects users randomly for anonymous conversations. While we do not store your chat content, you are responsible for your behavior while using our services. Violations may result in a permanent ban and/or legal action.'
  },
  { title: 'No Recording or Saving',
    text: 'You may not record, save, or distribute conversations without the explicit consent of all participants.'
  },
  { title: 'Privacy',
    text: 'We take your privacy seriously. Please refer to our',
    link: { label: 'Privacy Policy', path: '/privacy-policy'} ,
    afterText: ' for details on how we handle your data.'
  },
  { title: 'Modifications',
    text: 'We may update these Terms at any time. Continued use of the site after changes are made constitutes your acceptance of the new Terms.'
  },
  { title: 'Disclaimer',
    text: 'This service is provided “as is” and “as available.” We do not guarantee that the service will be secure, uninterrupted, or error-free.'
  },
  { title: 'Limitation of Liability',
    text: 'We are not liable for any damages resulting from your use or misuse of the platform. Use at your own risk.'
  },
]

export const privacyPolicyContents = [
  { title: 'Information We Collect',
    text: 'We do not require users to register or provide any personally identifiable information to use the chat service. However, we may collect the following data:',
    list: [
      { title: 'Device & Browser information' },
      { title: 'Usage Data' },
      { title: 'Messages' },
    ]
  },
  {
    title: 'How We Use Information',
    text: 'We use the collected data to:',
    list: [
      { title: 'Operate and improve our service' },
      { title: 'Prevent spam, abuse, and harmful behavior' },
      { title: 'Analyze user behavior in aggregate' },
      { title: 'Comply with legal obligations' }
    ]
  },
  { title: 'Cookies and Tracking',
    text: 'We may use cookies or local storage to store non-personal preferences or improve user experience. We do not use cookies for advertising or tracking you across the web.'
  },
  { title: 'Data Security',
    text: 'We use reasonable technical and administrative security measures to protect your data. However, no method of transmission over the internet is 100% secure.',
  },
  { title: 'Third-Party Services',
    text: 'We may use third-party services like analytics providers. These services may collect anonymized data to help us understand usage patterns.'
  },
  { title: "Children's Privacy",
    text: 'Our service is intended for users aged 18 and above. We do not knowingly collect personal information from children under 13.'
  },
  { title: 'Changes to This Policy',
    text: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with the new effective date.'
  },
]

export const communityGuidelinesContent = [
  { title: 'Be Respectful',
    text: 'Treat everyone with kindness and respect. Harassment, hate speech, discrimination, or bullying of any kind is strictly prohibited.',
    list: [
      { text: 'Do not threaten, insult, or demean others.' },
      { text: 'No racism, sexism, homophobia, or offensive content.' }
    ]
  },
  { title: 'No Inappropriate Content',
    text: 'This is not a platform for adult content. Any form of nudity, sexual content, or sexually suggestive behavior is not allowed.',
    list: [
      { text: 'No explicit photos, gestures, or messages.' }
    ]
  },
  { title: 'Keep It Anonymous',
    text: 'Do not share or request personal information such as:',
    list: [
      { text: 'Full name' },
      { text: 'Phone number' },
      { text: 'Email address' },
      { text: 'Social media handles' },
      { text: 'Home/work address' }
    ]
  },
  { title: 'No Spam of Self-Promotion',
    text: 'Please do not use this platform to advertise products, websites, or services.',
    list: [
      { text: 'No links, promotions, or sales pitches.'}
    ]
  },
  { title: 'Follow the Law',
    text: 'Illegal behavior will not be tolerated. This includes, but is not limited to:',
    list: [
      { text: 'Sharing illegal content' },
      { text: 'Attempting to exploit minors' },
      { text: 'Using the service to commit fraud' },
    ]
  },
  { title: 'Report Misconduct',
    text: `If you encounter someone violating these guidelines, please contact us at`,
  },
]

export const footerSectionContents = [
  { title: 'Terms of Service', path: '/terms-of-service' },
  { title: 'Privacy Policy', path: '/privacy-policy' },
  { title: 'Community Guidelines', path: '/community-guidelines' }
]
