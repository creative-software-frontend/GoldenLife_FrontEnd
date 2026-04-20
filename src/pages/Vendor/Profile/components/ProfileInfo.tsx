import { Mail, Phone, User, Building2, MapPin, Globe, Facebook, MessageCircle, Smartphone } from 'lucide-react';

interface ProfileInfoProps {
  user: {
    name: string;
    email: string;
    mobile: string;
    mobile_verify?: boolean;
  };
  vendor: {
    owner_name: string;
    businee_name?: string;   
    business_name?: string;  
    mobile?: string;
    country?: string;
    district?: string;
    address?: string;
    website?: string;
    facebook?: string;
    telegram?: string;
    whatsapp?: string;
  };
}

export function ProfileInfo({ user, vendor }: ProfileInfoProps) {
  // Safety defaults
  const safeUser = user || {};
  const safeVendor = vendor || {};
  
  // Debug logging
  console.log('📋 [ProfileInfo] Received data:', {
    hasUser: !!user,
    hasVendor: !!vendor,
    userKeys: user ? Object.keys(user) : 'N/A',
    vendorKeys: vendor ? Object.keys(vendor) : 'N/A',
    userName: user?.name,
    businessName: vendor?.business_name || vendor?.businee_name
  });
  
  const infoSections = [
    {
      title: 'Personal Information',
      items: [
        {
          icon: User,
          label: 'Full Name',
          value: safeUser.name || 'Not provided',
          color: 'primary-light'
        },
        {
          icon: Mail,
          label: 'Email Address',
          value: safeUser.email || 'Not provided',
          color: 'primary-dark'
        },
        {
          icon: Phone,
          label: 'Mobile Number',
          value: `${safeUser.mobile || safeVendor.mobile || 'Not provided'} ${safeUser.mobile_verify ? '✓' : ''}`,
          color: 'primary-light'
        }
      ]
    },
    {
      title: 'Business Information',
      items: [
        {
          icon: User,
          label: 'Owner Name',
          value: safeVendor.owner_name || 'Not provided',
          color: 'primary-dark'
        },
        {
          icon: Building2,
          label: 'Business Name',
          value: safeVendor.businee_name || safeVendor.business_name || 'Not provided',
          color: 'primary-light'
        },
        {
          icon: Phone,
          label: 'Business Mobile',
          value: safeVendor.mobile || 'Not provided',
          color: 'primary-dark'
        }
      ]
    },
    {
      title: 'Location Details',
      items: [
        {
          icon: MapPin,
          label: 'Country',
          value: safeVendor.country || 'Not provided',
          color: 'primary-light'
        },
        {
          icon: MapPin,
          label: 'District',
          value: safeVendor.district || 'Not provided',
          color: 'primary-dark'
        },
        {
          icon: MapPin,
          label: 'Address',
          value: safeVendor.address || 'Not provided',
          color: 'primary-light'
        }
      ]
    },
    {
      title: 'Online Presence',
      items: [
        {
          icon: Globe,
          label: 'Website',
          value: safeVendor.website ? (
            <a 
              href={safeVendor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-dark hover:underline"
            >
              Visit Website
            </a>
          ) : 'Not provided',
          color: 'primary-dark'
        },
        {
          icon: Facebook,
          label: 'Facebook',
          value: safeVendor.facebook ? (
            <a 
              href={safeVendor.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1877F2] hover:underline"
            >
              View Profile
            </a>
          ) : 'Not provided',
          color: '#1877F2'
        },
        {
          icon: MessageCircle,
          label: 'Telegram',
          value: safeVendor.telegram || 'Not provided',
          color: '#0088cc'
        },
        {
          icon: Smartphone,
          label: 'WhatsApp',
          value: safeVendor.whatsapp || 'Not provided',
          color: '#25D366'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {infoSections.map((section, sectionIdx) => (
        <div 
          key={sectionIdx}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20">
            {section.title}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {section.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div 
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {typeof item.value === 'string' ? item.value : item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
