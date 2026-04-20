import { Globe, Facebook, MessageCircle, Smartphone } from 'lucide-react';

interface SocialLinksProps {
  website?: string;
  facebook?: string;
  telegram?: string;
  whatsapp?: string;
}

export function SocialLinks({ 
  website, 
  facebook, 
  telegram, 
  whatsapp 
}: SocialLinksProps) {
  const links = [
    {
      icon: Globe,
      label: 'Website',
      url: website,
      color: '#6B7280',
      bgColor: 'bg-gray-100 hover:bg-gray-200'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      url: facebook,
      color: '#1877F2',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: MessageCircle,
      label: 'Telegram',
      text: telegram,
      color: '#0088cc',
      bgColor: 'bg-sky-50 hover:bg-sky-100'
    },
    {
      icon: Smartphone,
      label: 'WhatsApp',
      text: whatsapp,
      color: '#25D366',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100'
    }
  ];

  const hasLinks = links.some(link => link.url || link.text);

  if (!hasLinks) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Us</h3>
      
      <div className="flex flex-wrap gap-3">
        {links.map((link, index) => {
          if (!link.url && !link.text) return null;

          return (
            <a
              key={index}
              href={link.url || `https://wa.me/${link.text}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 px-4 py-2.5 ${link.bgColor} rounded-xl transition-all duration-300 hover:shadow-md`}
            >
              <link.icon size={18} style={{ color: link.color }} />
              <span className="text-sm font-semibold text-gray-700">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
