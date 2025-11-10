import { Monicon } from '@monicon/native';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-flags';

// Import local images
const myTouchPointLogo = require('../../assets/images/myTouchPointLogo1.png');
const waveLogo = require('../../assets/images/WaveSN-Logo.png');
const orangeMoneyLogo = require('../../assets/images/OMLogo-1.png');
const orangeOperatorLogo = require('../../assets/images/OrangeOP.jpeg');
const yasOperatorLogo = require('../../assets/images/YasOP.png');
const qrCodeImage = require('../../assets/images/QrCodeIMG.png');

type ServiceType = 'transfer' | 'airtime' | 'payment' | 'others';

export default function HomeScreen() {
  const [feesIncluded, setFeesIncluded] = useState(false);
  const [activeService, setActiveService] = useState<ServiceType>('transfer');

  const [fromOperator, setFromOperator] = useState('Wave');
  const [toOperator, setToOperator] = useState('Orange Money');
  const [fromPhone, setFromPhone] = useState('');
  const [toPhone, setToPhone] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'from' | 'to' | null>(null);
  const [contacts, setContacts] = useState<{ id: string; name: string; number: string }[]>([]);
  const [otherView, setOtherView] = useState<'overview' | 'insurance' | 'esim' | 'gifts'>('overview');
  const [insuranceForm, setInsuranceForm] = useState({
    vehicleModel: '',
    licensePlate: '',
    year: '',
    driverName: '',
    driverAge: '',
    email: '',
    phone: '',
  });
  const [giftSearch, setGiftSearch] = useState('');

  // Payment catalog state
  type PaymentCategory = 'schools' | 'corporate' | 'bills' | 'insurance';
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>('schools');
  const [paymentSearch, setPaymentSearch] = useState('');

  const PAYMENT_ITEMS: Record<PaymentCategory, { id: string; name: string }[]> = {
    schools: [
      { id: 'daust', name: 'DAUST' },
      { id: 'ism', name: 'ISM' },
      { id: 'cesag', name: 'CESAG' },
    ],
    corporate: [
      { id: 'sonatel', name: 'Sonatel' },
      { id: 'eiffage', name: 'Eiffage' },
      { id: 'totalenergies', name: 'TotalEnergies' },
    ],
    bills: [
      { id: 'senelec', name: 'SENELEC (Woyofal)' },
      { id: 'seneau', name: "SEN'EAU" },
      { id: 'canalplus', name: 'Canal+' },
    ],
    insurance: [
      { id: 'allianz', name: 'Allianz' },
      { id: 'nsia', name: 'NSIA' },
      { id: 'sunulife', name: 'SUNU Assurances' },
    ],
  };

  const filteredPaymentItems = PAYMENT_ITEMS[paymentCategory].filter((i) =>
    i.name.toLowerCase().includes(paymentSearch.trim().toLowerCase())
  );

  const ESIM_DEVICES = [
    'Apple iPhone 15 / 14 / 13 / 12 series',
    'Samsung Galaxy S23 / S22 / Z Flip / Z Fold',
    'Google Pixel 7 / 8 family',
    'Huawei P40 / Mate 40 eSIM edition',
    'Orange Sonatel eSIM-compatible smartwatches',
  ];

  const GIFT_OPTIONS = [
    { id: 'lekku-fii', name: 'LEKKU FII Gift Card', description: 'Send digital shopping credit redeemable in Dakar malls.' },
    { id: 'magal', name: 'Magal Touba Contribution', description: 'Secure your annual contribution ahead of the pilgrimage.' },
    { id: 'back-to-school', name: 'Back-to-school Fees', description: 'Pay school packs for Lycée Seydou Nourou Tall, Mariama Ba, and more.' },
    { id: 'kdo-orange', name: 'Orange KDO', description: 'Offer Orange digital gift vouchers to friends and family.' },
    { id: 'sargal', name: 'Sargal Rewards', description: 'Reward staff with Sargal corporate gift cards.' },
  ];

  const filteredGiftOptions = GIFT_OPTIONS.filter((item) => {
    const q = giftSearch.trim().toLowerCase();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (activeService !== 'others') {
      setOtherView('overview');
    }
  }, [activeService]);

  useEffect(() => {
    if (otherView !== 'gifts') {
      setGiftSearch('');
    }
  }, [otherView]);

  const handleInsuranceInputChange = (key: keyof typeof insuranceForm, value: string) => {
    setInsuranceForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRequestQuote = () => {
    if (!insuranceForm.vehicleModel || !insuranceForm.licensePlate || !insuranceForm.driverName) {
      Alert.alert('Missing information', 'Please fill vehicle, plate number, and driver name for the quote.');
      return;
    }
    Alert.alert(
      'Instant quote requested',
      `Sanlam will send a tailored premium estimation to ${insuranceForm.email || 'your email'} and call ${insuranceForm.driverName}.`
    );
  };

  const handleAttestationChannel = (channel: 'WhatsApp' | 'Email') => {
    Alert.alert('Attestation request sent', `We will deliver the insurance attestation via ${channel}.`);
  };

  const handleEsimAction = (action: 'activate' | 'purchase') => {
    Alert.alert(
      action === 'activate' ? 'Activation requested' : 'Purchase started',
      action === 'activate'
        ? 'Our support team will activate your e-SIM shortly.'
        : 'A sales advisor will assist you with your e-SIM purchase.'
    );
  };

  const handleGiftAction = (itemName: string, action: 'cart' | 'purchase') => {
    Alert.alert(
      'Coming soon',
      action === 'cart'
        ? `${itemName} has been added to your cart.`
        : `We will guide you to complete the purchase for ${itemName}.`
    );
  };

  const serviceSubtitle =
    activeService === 'transfer'
      ? 'One-tap transfers, anywhere.'
      : activeService === 'airtime'
      ? 'Recharge voice or data instantly.'
      : activeService === 'payment'
      ? 'Pay trusted Senegalese partners in a few taps.'
      : 'Explore extra services tailored for life in Senegal.';

  // Simple local image with fallback to initials to avoid blank renders
  const SafeImage = ({ source, size = 22, initials = 'N/A' }: { source?: any; size?: number; initials?: string }) => {
    const radius = size / 2;
    if (!source) {
      return (
        <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: Math.max(10, size * 0.45), color: '#4A5568', fontWeight: '700' }}>{initials}</Text>
        </View>
      );
    }
    return (
      <Image
        source={source}
        defaultSource={source}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="contain"
      />
    );
  };

  const renderOperatorDropdown = (value: string, onChange: (operator: string) => void) => (
    <View style={styles.dropdownContainer}>
      <View style={styles.dropdownLeft}>
        <Flag code="SN" size={24} type="flat" />
        <Text style={styles.dropdownText}>SEN</Text>
        <Monicon name="mdi:chevron-down" size={16} color="#666" />
      </View>
      <View style={styles.dropdownDivider} />
      <TouchableOpacity 
        style={styles.dropdownRightSingle}
        onPress={() => onChange(value === 'Wave' ? 'Orange Money' : 'Wave')}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={styles.operatorLogo}>
            <Image 
              source={value === 'Wave' ? waveLogo : orangeMoneyLogo} 
              style={styles.operatorImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.dropdownText, { fontWeight: '500' }]}>
            {value}
          </Text>
        </View>
        <Monicon name="mdi:chevron-down" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );

  // Airtime operator selector: only Orange or Yas
  const renderAirtimeOperatorDropdown = (value: string, onChange: (operator: string) => void) => {
    const current = value === 'Orange' || value === 'Yas' ? value : 'Orange';
    const next = current === 'Orange' ? 'Yas' : 'Orange';
    const logo = current === 'Orange' ? orangeOperatorLogo : yasOperatorLogo;
    return (
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdownLeft}>
          <Flag code="SN" size={24} type="flat" />
          <Text style={styles.dropdownText}>SEN</Text>
          <Monicon name="mdi:chevron-down" size={16} color="#666" />
        </View>
        <View style={styles.dropdownDivider} />
        <TouchableOpacity 
          style={styles.dropdownRightSingle}
          onPress={() => onChange(next)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={styles.operatorLogo}>
              <SafeImage source={logo} size={22} initials={current === 'Orange' ? 'OR' : 'YA'} />
            </View>
            <Text style={[styles.dropdownText, { fontWeight: '500' }]}> 
              {current}
            </Text>
          </View>
          <Monicon name="mdi:chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375; // iPhone SE, 5s, etc.
  const isMediumScreen = width >= 375 && width < 414; // iPhone 12, 13, etc.
  
  // Responsive font sizes
  const responsiveFont = {
    small: isSmallScreen ? 12 : 14,
    medium: isSmallScreen ? 14 : 16,
    large: isSmallScreen ? 16 : 18,
    xlarge: isSmallScreen ? 18 : 20,
  };

  return (
    <View style={styles.container}>
      {/* Top bar placeholders */}
      <View style={[styles.topBar, { paddingTop: isSmallScreen ? 16 : 20 }]}>
        <View style={styles.topBarLeft}>
          <Monicon name="mdi:menu" size={isSmallScreen ? 20 : 24} color="#fff" />
        </View>
        <View style={[styles.topBarRight, { width: isSmallScreen ? 100 : 120 }]}>
          <Monicon name="mdi:qrcode" size={isSmallScreen ? 20 : 24} color="#fff" />
          <Monicon name="mdi:help-circle-outline" size={isSmallScreen ? 20 : 24} color="#fff" />
          <Monicon name="mdi:bell-outline" size={isSmallScreen ? 20 : 24} color="#fff" />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.cardsContainer, { marginBottom: isSmallScreen ? 12 : 20 }]}>
          <View style={[styles.welcomeCard, { height: 'auto', paddingVertical: isSmallScreen ? 16 : 20 }]}>
            <View>
              <Text style={[styles.welcome, { fontSize: responsiveFont.small }]}>Welcome,</Text>
              <Text style={[styles.name, { fontSize: responsiveFont.large, marginBottom: 8 }]}>KHADIM SAMB</Text>
              <View style={styles.logoContainer}>
                <Image 
                  source={myTouchPointLogo} 
                  style={styles.appLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
          <View style={[styles.qrCard, { height: isSmallScreen ? 160 : 200 }]}>
            <Image 
              source={qrCodeImage} 
              style={styles.qr}
              resizeMode="contain"
            />
            <Text style={{ 
              fontSize: responsiveFont.small,
              marginTop: 4,
              color: '#00008B',
              fontWeight: '500'
            }}>
              Scan
            </Text>
          </View>
        </View>

        {/* Services Navigation */}
        <View style={[styles.services, { marginTop: 20, marginBottom: isSmallScreen ? 12 : 20 }]}>
          <TouchableOpacity 
            style={[
              styles.serviceItem, 
              activeService === 'transfer' && styles.activeServiceItem
            ]}
            onPress={() => setActiveService('transfer')}
          >
            <Monicon 
              name="mdi:swap-horizontal" 
              size={isSmallScreen ? 28 : 32} 
              color={activeService === 'transfer' ? '#00008B' : '#666666'} 
            />
            <Text style={[
              styles.serviceText, 
              { 
                fontSize: responsiveFont.small,
                color: activeService === 'transfer' ? '#00008B' : '#666666'
              }
            ]}>
              Transfer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.serviceItem, 
              activeService === 'airtime' && styles.activeServiceItem
            ]}
            onPress={() => setActiveService('airtime')}
          >
            <Monicon 
              name="mdi:signal" 
              size={isSmallScreen ? 28 : 32} 
              color={activeService === 'airtime' ? '#00008B' : '#666666'} 
            />
            <Text style={[
              styles.serviceText,
              {
                fontSize: responsiveFont.small,
                color: activeService === 'airtime' ? '#00008B' : '#666666'
              }
            ]}>
              Airtime
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.serviceItem, 
              activeService === 'payment' && styles.activeServiceItem
            ]}
            onPress={() => setActiveService('payment')}
          >
            <Monicon 
              name="mdi:credit-card" 
              size={isSmallScreen ? 28 : 32} 
              color={activeService === 'payment' ? '#00008B' : '#666666'}
            />
            <Text style={[
              styles.serviceText,
              {
                fontSize: responsiveFont.small,
                color: activeService === 'payment' ? '#00008B' : '#666666'
              }
            ]}>
              Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.serviceItem, 
              activeService === 'others' && styles.activeServiceItem
            ]}
            onPress={() => setActiveService('others')}
          >
            <Monicon 
              name="mdi:dots-horizontal" 
              size={isSmallScreen ? 28 : 32} 
              color={activeService === 'others' ? '#00008B' : '#666666'}
            />
            <Text style={[
              styles.serviceText,
              {
                fontSize: responsiveFont.small,
                color: activeService === 'others' ? '#00008B' : '#666666'
              }
            ]}>
              Others
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Container with Active Service Indicator */}
        <View style={[
          styles.formContainer, { 
            padding: isSmallScreen ? 12 : 20,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#00008B',
          }
        ]}>
          <Text style={[
            styles.sectionTitle, 
            { 
              fontSize: responsiveFont.large,
              color: '#00008B',
              marginBottom: 16,
              textTransform: 'capitalize'
            }
          ]}>
            {activeService === 'airtime' ? 'Buy Airtime' : 
             activeService === 'payment' ? 'Make Payment' : 
             activeService === 'others' ? 'Other Services' : 'Send Money'}
          </Text>
          <Text style={[styles.sectionSubtitle, { fontSize: responsiveFont.small }]}>
            {serviceSubtitle}
          </Text>
          
          {/* Sections depend on active service. For airtime, show "Select Operator" then "Pay with". For payment, show catalog. For others, display curated services. */}
          {activeService === 'airtime' ? (
            <>
              {/* Select Operator (recipient) */}
              <Text style={[styles.inputLabel, { fontSize: responsiveFont.small }]}> 
                Select Operator
              </Text>
              {renderAirtimeOperatorDropdown(toOperator, setToOperator)}

              <View style={[styles.phoneInputContainer, { height: isSmallScreen ? 44 : 50, marginTop: 10 }]}> 
                <TextInput 
                  style={[styles.phoneInput, { 
                    flex: 1, 
                    fontSize: responsiveFont.medium,
                    paddingVertical: isSmallScreen ? 8 : 12
                  }]} 
                  placeholder={'Phone Number'}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                  value={toPhone}
                  onChangeText={setToPhone}
                />
                <TouchableOpacity style={styles.contactButton} onPress={async () => {
                  setPickerTarget('to');
                  const { status } = await Contacts.requestPermissionsAsync();
                  if (status !== 'granted') return;
                  const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
                  const normalized = (data || []).flatMap((c) =>
                    (c.phoneNumbers || []).map((p) => ({ id: `${c.id}-${p.id || p.number}`, name: c.name || 'Unknown', number: (p.number || '').replace(/\s/g, '') }))
                  );
                  setContacts(normalized);
                  setIsPickerVisible(true);
                }}>
                  <Monicon name="mdi:account" size={isSmallScreen ? 18 : 20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Pay with (payer) */}
              <Text style={[styles.inputLabel, { 
                marginTop: 16, 
                fontSize: responsiveFont.small 
              }]}> 
                Pay with
              </Text>
              {renderOperatorDropdown(fromOperator, setFromOperator)}

              <View style={[styles.phoneInputContainer, { height: isSmallScreen ? 44 : 50, marginTop: 10 }]}> 
                <TextInput 
                  style={[styles.phoneInput, { 
                    flex: 1, 
                    fontSize: responsiveFont.medium,
                    paddingVertical: isSmallScreen ? 8 : 12
                  }]} 
                  placeholder={'Phone Number'}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                  value={fromPhone}
                  onChangeText={setFromPhone}
                />
                <TouchableOpacity style={styles.contactButton} onPress={async () => {
                  setPickerTarget('from');
                  const { status } = await Contacts.requestPermissionsAsync();
                  if (status !== 'granted') return;
                  const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
                  const normalized = (data || []).flatMap((c) =>
                    (c.phoneNumbers || []).map((p) => ({ id: `${c.id}-${p.id || p.number}`, name: c.name || 'Unknown', number: (p.number || '').replace(/\s/g, '') }))
                  );
                  setContacts(normalized);
                  setIsPickerVisible(true);
                }}>
                  <Monicon name="mdi:account" size={isSmallScreen ? 18 : 20} color="#666" />
                </TouchableOpacity>
              </View>
            </>
          ) : activeService === 'payment' ? (
            <>
              {/* Payment Categories */}
              <View style={styles.payCategoriesRow}>
                {[
                  { key: 'schools', label: 'Schools', icon: 'mdi:book-open-page-variant' },
                  { key: 'corporate', label: 'Corporate', icon: 'mdi:office-building' },
                  { key: 'bills', label: 'Bills', icon: 'mdi:receipt-text' },
                  { key: 'insurance', label: 'Insurance', icon: 'mdi:umbrella-outline' },
                ].map((c: any) => {
                  const selected = paymentCategory === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      style={[styles.payCatChip, selected && styles.payCatChipActive]}
                      onPress={() => setPaymentCategory(c.key)}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.payCatIconWrap, selected && styles.payCatIconActive]}> 
                        <Monicon name={c.icon} size={18} color={selected ? '#00008B' : '#6B6F76'} />
                      </View>
                      <Text style={[styles.payCatLabel, { color: selected ? '#00008B' : '#3C4043' }]}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Payment Search */}
              <View style={styles.paymentSearchBar}>
                <Monicon name="mdi:magnify" size={20} color="#666" />
                <TextInput
                  style={styles.paymentSearchInput}
                  placeholder="Search"
                  placeholderTextColor="#9AA0A6"
                  value={paymentSearch}
                  onChangeText={setPaymentSearch}
                />
              </View>

              {/* Section title */}
              <Text style={[styles.sectionTitle, { marginBottom: 10 }]}> 
                {paymentCategory === 'schools' ? 'Schools' :
                 paymentCategory === 'corporate' ? 'Corporate' :
                 paymentCategory === 'bills' ? 'Bills' : 'Insurance'}
              </Text>

              {/* List */}
              <View>
                {filteredPaymentItems.map((item) => {
                  const logo = undefined;
                  const initials = item.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <TouchableOpacity key={item.id} style={styles.payRow} activeOpacity={0.9}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F4F7', alignItems: 'center', justifyContent: 'center', marginRight: 10, overflow: 'hidden' }}>
                          <SafeImage source={logo} size={36} initials={initials} />
                        </View>
                        <Text style={styles.payRowTitle}>{item.name}</Text>
                      </View>
                      <Monicon name="mdi:chevron-right" size={20} color="#9AA0A6" />
                    </TouchableOpacity>
                  );
                })}
                {filteredPaymentItems.length === 0 && (
                  <Text style={{ color: '#8A8F94', textAlign: 'center', paddingVertical: 16 }}>No results</Text>
                )}
              </View>
            </>
          ) : activeService === 'others' ? (
            <>
              {otherView === 'overview' && (
                <View>
                  <View style={styles.otherCardsGrid}>
                    <TouchableOpacity style={styles.otherCard} activeOpacity={0.88} onPress={() => setOtherView('insurance')}>
                      <View style={[styles.otherCardIcon, { backgroundColor: '#E7F1FF' }]}> 
                        <Monicon name="mdi:car-info" size={24} color="#0A4BA7" />
                      </View>
                      <Text style={styles.otherCardTitle}>Insurance Services</Text>
                      <Text style={styles.otherCardSubtitle}>Get a Sanlam auto quote and retrieve attestations instantly.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.otherCard} activeOpacity={0.88} onPress={() => setOtherView('esim')}>
                      <View style={[styles.otherCardIcon, { backgroundColor: '#E8FFF3' }]}> 
                        <Monicon name="mdi:cellphone-wireless" size={24} color="#129B4A" />
                      </View>
                      <Text style={styles.otherCardTitle}>e-SIM Options</Text>
                      <Text style={styles.otherCardSubtitle}>Check compatible devices, activate or purchase a new e-SIM.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.otherCard} activeOpacity={0.88} onPress={() => setOtherView('gifts')}>
                      <View style={[styles.otherCardIcon, { backgroundColor: '#FFF4E5' }]}> 
                        <Monicon name="mdi:gift" size={24} color="#C05500" />
                      </View>
                      <Text style={styles.otherCardTitle}>Purchases & Gift Cards</Text>
                      <Text style={styles.otherCardSubtitle}>LEKKU FII, Magal payments, back-to-school packs and more.</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {otherView === 'insurance' && (
                <View>
                  <View style={styles.otherDetailHeader}>
                    <TouchableOpacity onPress={() => setOtherView('overview')} style={styles.backButton} accessibilityRole="button">
                      <Monicon name="mdi:arrow-left" size={20} color="#00008B" />
                    </TouchableOpacity>
                    <Text style={styles.otherDetailTitle}>Sanlam Auto Insurance</Text>
                  </View>
                  <Text style={styles.detailParagraph}>Get an instant quote for your vehicle and keep proof of insurance on your phone.</Text>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Vehicle model</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. Toyota Corolla 2021"
                      placeholderTextColor="#9AA0A6"
                      value={insuranceForm.vehicleModel}
                      onChangeText={(text) => handleInsuranceInputChange('vehicleModel', text)}
                    />
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formFieldHalf}>
                      <Text style={styles.formLabel}>License plate</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="DK-1234-AB"
                        placeholderTextColor="#9AA0A6"
                        value={insuranceForm.licensePlate}
                        onChangeText={(text) => handleInsuranceInputChange('licensePlate', text)}
                      />
                    </View>
                    <View style={styles.formFieldHalf}>
                      <Text style={styles.formLabel}>Year</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="2021"
                        placeholderTextColor="#9AA0A6"
                        keyboardType="numeric"
                        value={insuranceForm.year}
                        onChangeText={(text) => handleInsuranceInputChange('year', text)}
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={styles.formFieldHalf}>
                      <Text style={styles.formLabel}>Driver name</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Full name"
                        placeholderTextColor="#9AA0A6"
                        value={insuranceForm.driverName}
                        onChangeText={(text) => handleInsuranceInputChange('driverName', text)}
                      />
                    </View>
                    <View style={styles.formFieldHalf}>
                      <Text style={styles.formLabel}>Driver age</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="32"
                        placeholderTextColor="#9AA0A6"
                        keyboardType="numeric"
                        value={insuranceForm.driverAge}
                        onChangeText={(text) => handleInsuranceInputChange('driverAge', text)}
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Email</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="your@email.sn"
                      placeholderTextColor="#9AA0A6"
                      keyboardType="email-address"
                      value={insuranceForm.email}
                      onChangeText={(text) => handleInsuranceInputChange('email', text)}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Contact number</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="77 123 45 67"
                      placeholderTextColor="#9AA0A6"
                      keyboardType="phone-pad"
                      value={insuranceForm.phone}
                      onChangeText={(text) => handleInsuranceInputChange('phone', text)}
                    />
                  </View>

                  <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleRequestQuote}>
                    <Text style={styles.primaryButtonText}>Get instant quote</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.secondaryButton, { marginTop: 12 }]}
                    activeOpacity={0.9}
                    onPress={() => Alert.alert('Premium payment', 'Your mock premium payment has been recorded.')}
                  >
                    <Text style={styles.secondaryButtonText}>Mock premium payment</Text>
                  </TouchableOpacity>

                  <Text style={[styles.detailSubheading, { marginTop: 20 }]}>Receive attestation</Text>
                  <View style={styles.attestationRow}>
                    <TouchableOpacity style={styles.attestationChip} activeOpacity={0.9} onPress={() => handleAttestationChannel('WhatsApp')}>
                      <Monicon name="mdi:whatsapp" size={18} color="#25D366" />
                      <Text style={styles.attestationText}>WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attestationChip} activeOpacity={0.9} onPress={() => handleAttestationChannel('Email')}>
                      <Monicon name="mdi:email" size={18} color="#1A73E8" />
                      <Text style={styles.attestationText}>Email</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {otherView === 'esim' && (
                <View>
                  <View style={styles.otherDetailHeader}>
                    <TouchableOpacity onPress={() => setOtherView('overview')} style={styles.backButton} accessibilityRole="button">
                      <Monicon name="mdi:arrow-left" size={20} color="#00008B" />
                    </TouchableOpacity>
                    <Text style={styles.otherDetailTitle}>Manage e-SIM</Text>
                  </View>
                  <Text style={styles.detailParagraph}>Activate, purchase or review compatible devices for your digital line.</Text>

                  <Text style={styles.detailSubheading}>Compatible devices</Text>
                  <View style={styles.deviceList}>
                    {ESIM_DEVICES.map((device) => (
                      <View key={device} style={styles.deviceItem}>
                        <Monicon name="mdi:cellphone" size={18} color="#5F6368" />
                        <Text style={styles.deviceText}>{device}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={() => handleEsimAction('activate')} activeOpacity={0.9}>
                      <Text style={styles.primaryButtonText}>Activate e-SIM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.secondaryButton, { flex: 1, marginLeft: 12 }]}
                      onPress={() => handleEsimAction('purchase')}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.secondaryButtonText}>Purchase e-SIM</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {otherView === 'gifts' && (
                <View>
                  <View style={styles.otherDetailHeader}>
                    <TouchableOpacity onPress={() => setOtherView('overview')} style={styles.backButton} accessibilityRole="button">
                      <Monicon name="mdi:arrow-left" size={20} color="#00008B" />
                    </TouchableOpacity>
                    <Text style={styles.otherDetailTitle}>Purchases & Gift Cards</Text>
                  </View>
                  <Text style={styles.detailParagraph}>Offer memorable gifts or settle community payments without leaving the app.</Text>

                  <View style={styles.otherSearchBar}>
                    <Monicon name="mdi:magnify" size={20} color="#666" />
                    <TextInput
                      style={styles.otherSearchInput}
                      placeholder="Search gifts, events, merchants"
                      placeholderTextColor="#9AA0A6"
                      value={giftSearch}
                      onChangeText={setGiftSearch}
                    />
                  </View>

                  {filteredGiftOptions.map((option) => (
                    <View key={option.id} style={styles.giftCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.giftTitle}>{option.name}</Text>
                        <Text style={styles.giftDescription}>{option.description}</Text>
                      </View>
                      <View style={styles.giftActions}>
                        <TouchableOpacity
                          style={styles.inlineButton}
                          activeOpacity={0.9}
                          onPress={() => handleGiftAction(option.name, 'cart')}
                        >
                          <Monicon name="mdi:cart-plus" size={18} color="#00008B" />
                          <Text style={styles.inlineButtonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.inlineButton, styles.inlineButtonPrimary]}
                          activeOpacity={0.9}
                          onPress={() => handleGiftAction(option.name, 'purchase')}
                        >
                          <Monicon name="mdi:flash" size={18} color="#fff" />
                          <Text style={[styles.inlineButtonText, { color: '#fff' }]}>Purchase</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  {filteredGiftOptions.length === 0 && (
                    <Text style={styles.emptyNote}>No options match your search yet.</Text>
                  )}
                </View>
              )}
            </>
          ) : (
            <>
              {/* From Section (default flows) */}
          <Text style={[styles.inputLabel, { fontSize: responsiveFont.small }]}>
            From
          </Text>
          {renderOperatorDropdown(fromOperator, setFromOperator)}
          
          <View style={[styles.phoneInputContainer, { height: isSmallScreen ? 44 : 50, marginTop: 10 }]}>
            <TextInput 
              style={[styles.phoneInput, { 
                flex: 1, 
                fontSize: responsiveFont.medium,
                paddingVertical: isSmallScreen ? 8 : 12
              }]} 
              placeholder={'Phone Number'}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
              value={fromPhone}
              onChangeText={setFromPhone}
            />
            <TouchableOpacity style={styles.contactButton} onPress={async () => {
              setPickerTarget('from');
              const { status } = await Contacts.requestPermissionsAsync();
              if (status !== 'granted') return;
              const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
              const normalized = (data || []).flatMap((c) =>
                (c.phoneNumbers || []).map((p) => ({ id: `${c.id}-${p.id || p.number}`, name: c.name || 'Unknown', number: (p.number || '').replace(/\s/g, '') }))
              );
              setContacts(normalized);
              setIsPickerVisible(true);
            }}>
              <Monicon name="mdi:account" size={isSmallScreen ? 18 : 20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* To Section */}
          <Text style={[styles.inputLabel, { 
            marginTop: 16, 
            fontSize: responsiveFont.small 
          }]}>
            To
          </Text>
          {renderOperatorDropdown(toOperator, setToOperator)}
          
          <View style={[styles.phoneInputContainer, { height: isSmallScreen ? 44 : 50, marginTop: 10 }]}>
            <TextInput 
              style={[styles.phoneInput, { 
                flex: 1, 
                fontSize: responsiveFont.medium,
                paddingVertical: isSmallScreen ? 8 : 12
              }]} 
              placeholder={'Phone Number'}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
              value={toPhone}
              onChangeText={setToPhone}
            />
            <TouchableOpacity style={styles.contactButton} onPress={async () => {
              setPickerTarget('to');
              const { status } = await Contacts.requestPermissionsAsync();
              if (status !== 'granted') return;
              const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
              const normalized = (data || []).flatMap((c) =>
                (c.phoneNumbers || []).map((p) => ({ id: `${c.id}-${p.id || p.number}`, name: c.name || 'Unknown', number: (p.number || '').replace(/\s/g, '') }))
              );
              setContacts(normalized);
              setIsPickerVisible(true);
            }}>
              <Monicon name="mdi:account" size={isSmallScreen ? 18 : 20} color="#666" />
            </TouchableOpacity>
          </View>
            </>
          )}

          {/* Amount/Fees/Continue only for non-payment flows */}
          {activeService !== 'payment' && activeService !== 'others' && (
            <>
          {/* Amount Section */}
          <Text style={[styles.inputLabel, { 
            marginTop: 16, 
            fontSize: responsiveFont.small 
          }]}>
            Amount
          </Text>
          <View style={[styles.phoneInputContainer, { height: isSmallScreen ? 44 : 50, marginTop: 10 }]}> 
            <TextInput 
              style={[styles.phoneInput, { 
                flex: 1, 
                fontSize: responsiveFont.medium,
                paddingVertical: isSmallScreen ? 8 : 12
              }]} 
              placeholder="Amount" 
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Fees Checkbox */}
          <View style={[styles.checkboxContainer, { marginTop: isSmallScreen ? 8 : 12 }]}>
            <TouchableOpacity 
              style={[styles.checkbox, feesIncluded && styles.checkboxChecked, {
                width: isSmallScreen ? 18 : 20,
                height: isSmallScreen ? 18 : 20,
              }]}
              onPress={() => setFeesIncluded(!feesIncluded)}
            >
              {feesIncluded && <Monicon name="mdi:check" size={isSmallScreen ? 14 : 16} color="#00008B" />}
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, { fontSize: responsiveFont.small }]}>Fees included</Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={[
            styles.continueButton, 
            { 
              height: isSmallScreen ? 44 : 50,
              marginTop: isSmallScreen ? 12 : 16
            }
          ]}>
            <Text style={[styles.continueButtonText, { fontSize: responsiveFont.medium }]}>
              Continue
            </Text>
          </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Contact Picker Modal */}
      <Modal visible={isPickerVisible} transparent animationType="slide" onRequestClose={() => setIsPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={{ fontWeight: '700', color: '#111' }}>Select contact</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                <Monicon name="mdi:close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 360 }}>
              {contacts.map((c) => (
                <TouchableOpacity key={c.id} style={styles.contactRow} onPress={() => {
                  if (pickerTarget === 'from') setFromPhone(c.number);
                  if (pickerTarget === 'to') setToPhone(c.number);
                  setIsPickerVisible(false);
                }}>
                  <View style={styles.contactAvatar}>
                    <Monicon name="mdi:account" size={18} color="#555" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#111', fontWeight: '600' }}>{c.name}</Text>
                    <Text style={{ color: '#666', marginTop: 2 }}>{c.number}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {contacts.length === 0 && (
                <Text style={{ textAlign: 'center', color: '#666', paddingVertical: 16 }}>No contacts</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30, // Extra padding at the bottom for better scrolling
  },
  // Form Container
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  sectionSubtitle: {
    color: '#4A4F55',
    marginBottom: 20,
    fontWeight: '500',
  },
  otherCardsGrid: {
    gap: 14,
  },
  otherCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  otherCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otherCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111826',
    marginBottom: 4,
  },
  otherCardSubtitle: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },
  otherDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  otherDetailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1F44',
  },
  detailParagraph: {
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  detailSubheading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 14,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  formFieldHalf: {
    flex: 1,
  },
  formLabel: {
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#1F2937',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#00008B',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#BFC4CE',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#0A1F44',
    fontWeight: '600',
  },
  attestationRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  attestationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attestationText: {
    marginLeft: 8,
    color: '#1F2937',
    fontWeight: '600',
  },
  deviceList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    marginBottom: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  deviceText: {
    marginLeft: 10,
    color: '#374151',
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  otherSearchBar: {
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherSearchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
  },
  giftCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E7EA',
    padding: 16,
    marginBottom: 12,
  },
  giftTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  giftDescription: {
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  giftActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  inlineButtonPrimary: {
    backgroundColor: '#00008B',
    borderColor: '#00008B',
  },
  inlineButtonText: {
    color: '#00008B',
    fontWeight: '600',
  },
  emptyNote: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
  // Payment catalog styles
  payCategoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  payCatChip: {
    alignItems: 'center',
    width: '23%',
  },
  payCatChipActive: {},
  payCatIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  payCatIconActive: {
    backgroundColor: '#E8F0FE',
  },
  payCatLabel: {
    fontSize: 12,
    color: '#3C4043',
    fontWeight: '500',
  },
  paymentSearchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentSearchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
  },
  payRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E7EA',
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  payRowTitle: {
    color: '#111',
    fontWeight: '600',
  },
  dropdownContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 50,
    marginBottom: 10,
    overflow: 'hidden',
  },
  dropdownLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
  },
  dropdownRight: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  dropdownRightSingle: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  operatorOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectedOperator: {
    backgroundColor: '#F0F7FF',
  },
  operatorDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E0E0E0',
  },
  dropdownDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  dropdownText: {
    marginLeft: 8,
    marginRight: 4,
    color: '#333',
  },
  flag: {
    fontSize: 20,
  },
  phonePrefix: {
    paddingHorizontal: 12,
    color: '#000',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    textAlignVertical: 'center',
    height: '100%',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
  },
  phoneInput: {
    paddingHorizontal: 12,
    color: '#333',
    height: '100%',
  },
  contactButton: {
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  currency: {
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E3F2FD',
    borderColor: '#00008B',
  },
  checkboxLabel: {
    color: '#666',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#00008B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: { 
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: { 
    flexDirection: 'row',
    backgroundColor: '#00008B',
    padding: 10,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
    marginBottom: 8,
  },
  topBarLeft: {
    flex: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  welcomeCard: { 
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 0.42,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 100,
    marginRight: 12
  },
  logoContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  appLogo: {
    width: 140,
    height: 35,
  },
  operatorLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  operatorImage: {
    width: '100%',
    height: '100%',
  },
  
  qrCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 0.58,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 120
  },
  welcome: { 
    fontSize: 14,
    color: '#666',
  },
  name: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  qr: { 
    width: '100%', 
    height: '100%', 
  },
  services: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  serviceItem: { 
    alignItems: 'center',
    width: '23%',
    padding: 8,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeServiceItem: {
    borderBottomColor: '#00008B',
  },
  serviceText: {
    marginTop: 4,
    fontWeight: '500',
    color: '#000000',
  },
  inputLabel: { 
    color: '#666', 
    marginBottom: 8, 
    fontSize: 14,
    fontWeight: '500',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  }
});