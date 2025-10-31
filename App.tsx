import React, { useState, useMemo, useContext, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Dimensions,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const COLORS = {
  turquoise: '#40EDD0',
  blue: '#007BFF',
  lightBlue: '#E6F7FF',
  darkBlue: '#0056b3',
  white: '#ffffff',
  gray: '#f5f5f5',
  textDark: '#333',
};

// Course data
const courses = {
  sixMonth: [
    {
      id: '1',
      title: 'First Aid',
      duration: '6 months',
      price: 'R1500',
      purpose: 'To provide first aid awareness and basic life support',
      content: [
        'Wounds and bleeding',
        'Burns and fractures',
        'Emergency scene management',
        'Cardio-Pulmonary Resuscitation (CPR)',
        'Respiratory distress e.g., Choking, blocked airway'
      ],
      icon: 'medical',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300'
    },
    {
      id: '2',
      title: 'Sewing',
      duration: '6 months',
      price: 'R1500',
      purpose: 'To provide alterations and new garment tailoring services',
      content: [
        'Types of stitches',
        'Threading a sewing machine',
        'Sewing buttons, zips, hems and seams',
        'Alterations',
        'Designing and sewing new garments'
      ],
      icon: 'cut',
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300'
    },
    {
      id: '3',
      title: 'Landscaping',
      duration: '6 months',
      price: 'R1500',
      purpose: 'To provide landscaping services for new and established gardens',
      content: [
        'Indigenous and exotic plants and trees',
        'Fixed structures (fountains, statues, benches, tables, built-in braai)',
        'Balancing of plants and trees in a garden',
        'Aesthetics of plant shapes and colours',
        'Garden layout'
      ],
      icon: 'leaf',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300'
    },
    {
      id: '4',
      title: 'Life Skills',
      duration: '6 months',
      price: 'R1500',
      purpose: 'To provide skills to navigate basic life necessities',
      content: [
        'Opening a bank account',
        'Basic labour law (know your rights)',
        'Basic reading and writing literacy',
        'Basic numeric literacy'
      ],
      icon: 'school',
      image: 'https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=300'
    }
  ],
  sixWeek: [
    {
      id: '5',
      title: 'Child Minding',
      duration: '6 weeks',
      price: 'R750',
      purpose: 'To provide basic child and baby care',
      content: [
        'Birth to six-month old baby needs',
        'Seven-month to one year old needs',
        'Toddler needs',
        'Educational toys'
      ],
      icon: 'heart',
      image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=300'
    },
    {
      id: '6',
      title: 'Cooking',
      duration: '6 weeks',
      price: 'R750',
      purpose: 'To prepare and cook nutritious family meals',
      content: [
        'Nutritional requirements for a healthy body',
        'Types of protein, carbohydrates and vegetables',
        'Planning meals',
        'Tasty and nutritious recipes',
        'Preparation and cooking of meals'
      ],
      icon: 'restaurant',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'
    },
    {
      id: '7',
      title: 'Garden Maintenance',
      duration: '6 weeks',
      price: 'R750',
      purpose: 'To provide basic knowledge of watering, pruning and planting in a domestic garden',
      content: [
        'Water restrictions and the watering requirements of indigenous and exotic plants',
        'Pruning and propagation of plants',
        'Planting techniques for different plant types'
      ],
      icon: 'leaf',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300'
    }
  ]
};

// Cart Context
const CartContext = createContext();

// Quote Context to manage quote requests
const QuoteContext = createContext();

// Enhanced Custom Header Component with Back Button
function CustomHeader({ navigation, title, showBackButton = false }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkBlue} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={COLORS.darkBlue} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.headerLogo}>
        <Image 
          source={require('./assets/logo.jpg')}
          style={styles.headerLogoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerLogoText}>{title}</Text>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
          <Ionicons name="home" size={20} color={COLORS.darkBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Enhanced Custom Drawer Content
function CustomDrawerContent(props) {
  const { cart } = useContext(CartContext);
  
  const handleNavigation = (screenName) => {
    props.navigation.navigate(screenName);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/logo.jpg')}
            style={styles.drawerLogo}
            resizeMode="contain"
          />
          <Text style={styles.companyName}>Empowering the Nation</Text>
        </View>
        <Text style={styles.companyTagline}>Digi-Cynergy</Text>
      </View>

      <View style={styles.drawerItems}>
        <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation('Home')}>
          <Ionicons name="home" size={20} color={COLORS.darkBlue} />
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation('Courses')}>
          <Ionicons name="book" size={20} color={COLORS.darkBlue} />
          <Text style={styles.drawerItemText}>Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation('Cart')}>
          <Ionicons name="cart" size={20} color={COLORS.darkBlue} />
          <Text style={styles.drawerItemText}>Cart ({cart.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation('Contact')}>
          <Ionicons name="location" size={20} color={COLORS.darkBlue} />
          <Text style={styles.drawerItemText}>Contact & Quotes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Empowering the Nation</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
            <Ionicons name="logo-facebook" size={20} color={COLORS.darkBlue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
            <Ionicons name="logo-instagram" size={20} color={COLORS.darkBlue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
            <Ionicons name="logo-twitter" size={20} color={COLORS.darkBlue} />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

// Course Card Component
function CourseCard({ item, onPressAdd, onPressOpen }){
  const getIconName = (icon) => {
    const iconMap = {
      'medical': 'medkit-outline',
      'cut': 'cut-outline',
      'leaf': 'leaf-outline',
      'school': 'school-outline',
      'heart': 'heart-outline',
      'restaurant': 'restaurant-outline'
    };
    return iconMap[icon] || 'book-outline';
  };

  return (
    <TouchableOpacity style={styles.courseCard} onPress={() => onPressOpen(item)}>
      <View style={styles.courseImageContainer}>
        <View style={styles.courseIcon}>
          <Ionicons name={getIconName(item.icon)} size={32} color={COLORS.white} />
        </View>
        <Image 
          source={{ uri: item.image }} 
          style={styles.courseImage}
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300' }}
        />
        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={(e) => {
            e.stopPropagation();
            onPressAdd(item);
            Alert.alert('Added to Cart', `${item.title} has been added to your cart`);
          }}
        >
          <Ionicons name="cart" size={16} color={COLORS.white} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDetails}>Duration: {item.duration}</Text>
        <Text style={styles.coursePrice}>{item.price}</Text>
        <TouchableOpacity style={styles.learnMoreBtn} onPress={() => onPressOpen(item)}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// Home Screen
function HomeScreen({ navigation }){
  const { setQuoteRequested } = useContext(QuoteContext);

  const handleGetQuote = () => {
    setQuoteRequested(true);
    navigation.navigate('Contact');
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        {/* Hero Banner with Logo */}
        <View style={styles.heroBanner}>
          <Image 
            source={require('./assets/logo.jpg')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Empowering the Nation</Text>
          <Text style={styles.heroSubtitle}>Providing practical skills for real-world success</Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.getQuoteBtn} onPress={handleGetQuote}>
              <Text style={styles.getQuoteText}>Get a Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.browseCoursesBtn} onPress={() => navigation.navigate('Courses')}>
              <Text style={styles.browseCoursesText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Navigation Cards */}
        <View style={styles.quickNavSection}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          <View style={styles.quickNavCards}>
            <TouchableOpacity style={styles.quickNavCard} onPress={() => navigation.navigate('Courses')}>
              <Ionicons name="book" size={32} color={COLORS.turquoise} />
              <Text style={styles.quickNavText}>View Courses</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickNavCard} onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="cart" size={32} color={COLORS.turquoise} />
              <Text style={styles.quickNavText}>My Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickNavCard} onPress={handleGetQuote}>
              <Ionicons name="document-text" size={32} color={COLORS.turquoise} />
              <Text style={styles.quickNavText}>Get Quote</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Courses Section */}
        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          <Text style={styles.sectionSubtitle}>Click below to view full course details and enroll</Text>
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('Courses')}>
            <Text style={styles.viewAllBtnText}>View All Courses</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image 
            source={require('./assets/logo.jpg')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerTitle}>Empowering the Nation</Text>
          <Text style={styles.footerTagline}>Digi-Cynergy</Text>
          <View style={styles.footerSocials}>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
              <Ionicons name="logo-facebook" size={24} color={COLORS.darkBlue} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
              <Ionicons name="logo-instagram" size={24} color={COLORS.darkBlue} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
              <Ionicons name="logo-twitter" size={24} color={COLORS.darkBlue} />
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>© {new Date().getFullYear()} Empowering the Nation. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Courses Screen
function CoursesScreen({ navigation }){
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('sixMonth');
  const { addToCart, setSelectedCourse, openModal } = useContext(CartContext);

  const allCourses = useMemo(() => {
    const list = courses[tab];
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.purpose.toLowerCase().includes(q) ||
      c.content.some(item => item.toLowerCase().includes(q))
    );
  }, [tab, query]);

  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput 
          placeholder="Search courses..." 
          value={query} 
          onChangeText={setQuery} 
          style={styles.searchInput} 
          placeholderTextColor={COLORS.textDark}
        />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, tab==='sixMonth' && styles.tabBtnActive]} 
          onPress={() => setTab('sixMonth')}
        >
          <Text style={tab==='sixMonth' ? styles.tabTextActive : styles.tabText}>Six Month Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, tab==='sixWeek' && styles.tabBtnActive]} 
          onPress={() => setTab('sixWeek')}
        >
          <Text style={tab==='sixWeek' ? styles.tabTextActive : styles.tabText}>Six Week Courses</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={allCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.coursesList}
        renderItem={({item}) => (
          <CourseCard
            item={item}
            onPressAdd={addToCart}
            onPressOpen={(course) => { 
              setSelectedCourse(course); 
              openModal(); 
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Ionicons name="search" size={48} color={COLORS.gray} />
            <Text style={styles.noResultsText}>No courses found matching your search</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Cart Screen
function CartScreen({ navigation }){
  const { cart, removeFromCart, getTotal, getDiscountedTotal } = useContext(CartContext);
  
  const calculateDiscount = () => {
    if (cart.length === 0) return 0;
    if (cart.length === 1) return 0;
    if (cart.length === 2) return 0.05;
    if (cart.length === 3) return 0.10;
    return 0.15;
  };

  const discount = calculateDiscount();
  const total = getTotal();
  const discountedTotal = getDiscountedTotal();

  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
      <ScrollView contentContainerStyle={styles.cartContainer}>
        <Text style={styles.cartTitle}>Your Shopping Cart</Text>
        
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart" size={64} color={COLORS.gray} />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.browseCoursesEmptyBtn}
              onPress={() => navigation.navigate('Courses')}
            >
              <Text style={styles.browseCoursesEmptyText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cart.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemTitle}>{item.title}</Text>
                  <Text style={styles.cartItemPrice}>{item.price}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="trash" size={20} color="#cc0000" />
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={styles.cartSummary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>R{total}</Text>
              </View>
              
              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount ({discount * 100}%):</Text>
                  <Text style={styles.discountValue}>-R{total - discountedTotal}</Text>
                </View>
              )}
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>R{discountedTotal}</Text>
              </View>
            </View>

            {/* Discount Policy */}
            <View style={styles.discountPolicy}>
              <Text style={styles.policyTitle}>Course Discount Policy</Text>
              <Text style={styles.policyText}>
                Customers can select from a range of courses available. The more courses selected, the more discount received:
              </Text>
              <Text style={styles.policyItem}>• One course – no discount</Text>
              <Text style={styles.policyItem}>• Two courses – 5% discount</Text>
              <Text style={styles.policyItem}>• Three courses – 10% discount</Text>
              <Text style={styles.policyItem}>• More than three courses – 15% discount</Text>
            </View>

            <TouchableOpacity 
              style={styles.confirmPayBtn}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.confirmPayText}>Confirm & Pay R{discountedTotal}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.continueShoppingBtn}
              onPress={() => navigation.navigate('Courses')}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Checkout Screen
function CheckoutScreen({ navigation }){
  const { cart, clearCart, getDiscountedTotal } = useContext(CartContext);
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    phone: '', 
    cardDetails: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Function to validate phone number format
  const validatePhone = (phone) => {
    const re = /^[+]?[0-9]{10,15}$/;
    return re.test(phone);
  };

  // Function to validate card details (simple validation)
  const validateCardDetails = (cardDetails) => {
    return cardDetails.trim().length > 0;
  };

  const handleCheckout = () => {
    // Validate form data
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    
    if (!validateEmail(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (!validatePhone(form.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    if (!validateCardDetails(form.cardDetails)) {
      Alert.alert('Error', 'Please enter valid card details');
      return;
    }
    
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsProcessing(false);
      
      // Show success message with banking details
      Alert.alert(
        'Payment Successful', 
        `Payment of R${getDiscountedTotal()} processed successfully!\n\nYou will receive a confirmation email at ${form.email}\n\nBanking Details:\nBank: Standard Bank\nAccount: 0123456789\nBranch: 051001\nReference: ${Date.now()}`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              setForm({ name: '', email: '', phone: '', cardDetails: '' });
              navigation.navigate('Home');
            }
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
      <ScrollView contentContainerStyle={styles.checkoutContainer}>
        <Text style={styles.checkoutTitle}>Checkout</Text>
        
        <TextInput 
          placeholder="Enter your full name" 
          style={styles.input} 
          value={form.name} 
          onChangeText={(text) => setForm({...form, name: text})} 
          placeholderTextColor={COLORS.textDark}
        />
        
        <TextInput 
          placeholder="Enter your email address" 
          style={styles.input} 
          value={form.email} 
          onChangeText={(text) => setForm({...form, email: text})} 
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textDark}
        />
        
        <TextInput 
          placeholder="Enter your phone number" 
          style={styles.input} 
          value={form.phone} 
          onChangeText={(text) => setForm({...form, phone: text})} 
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.textDark}
        />
        
        <TextInput 
          placeholder="Enter your card payment information" 
          style={styles.input} 
          value={form.cardDetails} 
          onChangeText={(text) => setForm({...form, cardDetails: text})} 
          placeholderTextColor={COLORS.textDark}
        />

        {/* Banking Details Section */}
        <View style={styles.bankingSection}>
          <Text style={styles.bankingTitle}>Banking Details</Text>
          <View style={styles.bankingInfo}>
            <Text style={styles.bankingItem}><Text style={styles.bankingLabel}>Bank:</Text> Standard Bank</Text>
            <Text style={styles.bankingItem}><Text style={styles.bankingLabel}>Account Number:</Text> 0123456789</Text>
            <Text style={styles.bankingItem}><Text style={styles.bankingLabel}>Branch Code:</Text> 051001</Text>
            <Text style={styles.bankingItem}><Text style={styles.bankingLabel}>Reference:</Text> Your Name</Text>
            <Text style={styles.bankingNote}>
              Please use your name as reference when making payment. Email proof of payment to payments@digicynergy.org
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.payNowBtn, 
            (cart.length === 0 || isProcessing) && styles.disabledBtn
          ]}
          onPress={handleCheckout}
          disabled={cart.length === 0 || isProcessing}
        >
          <Text style={styles.payNowBtnText}>
            {isProcessing ? 'Processing...' : `Confirm & Pay R${getDiscountedTotal()}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backToCartBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToCartText}>Back to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Contact Screen
function ContactScreen({ navigation }){
  const { quoteRequested, setQuoteRequested } = useContext(QuoteContext);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
    message: ''
  });

  const handleSubmitQuote = () => {
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Quote Request Submitted',
      `Thank you ${quoteForm.name}! We have received your quote request for ${quoteForm.courseInterest || 'our courses'}. We will contact you at ${quoteForm.email} within 24 hours.`,
      [
        {
            text: 'OK',
            onPress: () => {
              setQuoteForm({
                name: '',
                email: '',
                phone: '',
                courseInterest: '',
                message: ''
              });
              setQuoteRequested(false);
            }
          }
        ]
      );
    };

    return (
      <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
        <ScrollView contentContainerStyle={styles.contactContainer}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          
          {quoteRequested && (
            <View style={styles.quoteBanner}>
              <Ionicons name="document-text" size={32} color={COLORS.white} />
              <Text style={styles.quoteBannerText}>We're here to help you get started!</Text>
              <Text style={styles.quoteBannerSubtext}>Please fill out the form below and we'll get back to you with a personalized quote.</Text>
            </View>
          )}

          <View style={styles.contactInfo}>
            <Ionicons name="location" size={24} color={COLORS.turquoise} />
            <Text style={styles.contactText}>Office: 123 Main Street, Johannesburg, South Africa</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL('tel:+27123456789')}
            style={styles.contactItem}
          >
            <Ionicons name="call" size={24} color={COLORS.turquoise} />
            <Text style={styles.contactLinkText}>Call us: +27 12 345 6789</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => Linking.openURL('mailto:info@digicynergy.org')}
            style={styles.contactItem}
          >
            <Ionicons name="mail" size={24} color={COLORS.turquoise} />
            <Text style={styles.contactLinkText}>Email: info@digicynergy.org</Text>
          </TouchableOpacity>

          {/* Quote Request Form */}
          <View style={styles.quoteForm}>
            <Text style={styles.quoteFormTitle}>
              {quoteRequested ? 'Request a Personalized Quote' : 'Get a Quote'}
            </Text>
            
            <TextInput
              style={styles.quoteInput}
              placeholder="Your Full Name *"
              value={quoteForm.name}
              onChangeText={(text) => setQuoteForm({...quoteForm, name: text})}
              placeholderTextColor={COLORS.textDark}
            />
            
            <TextInput
              style={styles.quoteInput}
              placeholder="Your Email Address *"
              value={quoteForm.email}
              onChangeText={(text) => setQuoteForm({...quoteForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.textDark}
            />
            
            <TextInput
              style={styles.quoteInput}
              placeholder="Your Phone Number *"
              value={quoteForm.phone}
              onChangeText={(text) => setQuoteForm({...quoteForm, phone: text})}
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.textDark}
            />
            
            <TextInput
              style={styles.quoteInput}
              placeholder="Course(s) of Interest"
              value={quoteForm.courseInterest}
              onChangeText={(text) => setQuoteForm({...quoteForm, courseInterest: text})}
              placeholderTextColor={COLORS.textDark}
            />
            
            <TextInput
              style={[styles.quoteInput, styles.quoteTextArea]}
              placeholder="Additional Message or Requirements"
              value={quoteForm.message}
              onChangeText={(text) => setQuoteForm({...quoteForm, message: text})}
              multiline
              numberOfLines={4}
              placeholderTextColor={COLORS.textDark}
            />
            
            <TouchableOpacity style={styles.submitQuoteBtn} onPress={handleSubmitQuote}>
              <Text style={styles.submitQuoteText}>Submit Quote Request</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Follow us on social media</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://facebook.com')}
              >
                <Ionicons name="logo-facebook" size={24} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://instagram.com')}
              >
                <Ionicons name="logo-instagram" size={24} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => Linking.openURL('https://x.com')}
              >
                <Ionicons name="logo-twitter" size={24} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Twitter</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={48} color={COLORS.gray} />
            <Text style={styles.mapText}>Location Map</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Stack and Drawer Navigators
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  function HomeStack() {
    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          header: () => (
            <CustomHeader 
              navigation={navigation} 
              title={
                route.name === 'Home' ? 'Empowering the Nation' :
                route.name === 'Courses' ? 'Our Courses' :
                route.name === 'Cart' ? 'Shopping Cart' :
                route.name === 'Checkout' ? 'Checkout' :
                route.name === 'Contact' ? 'Contact & Quotes' :
                'Digi-Cynergy'
              }
              showBackButton={route.name !== 'Home'}
            />
          ),
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    );
  }

  // Main App Component
  export default function App(){
    const [cart, setCart] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [quoteRequested, setQuoteRequested] = useState(false);

    const addToCart = (course) => {
      setCart(prev => [...prev, course]);
    };

    const removeFromCart = (id) => {
      setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
      setCart([]);
    };

    const getTotal = () => {
      return cart.reduce((total, item) => {
        const price = parseInt(item.price.replace('R', ''));
        return total + price;
      }, 0);
    };

    const getDiscountedTotal = () => {
      const total = getTotal();
      let discount = 0;
      
      if (cart.length === 2) discount = 0.05;
      else if (cart.length === 3) discount = 0.10;
      else if (cart.length > 3) discount = 0.15;
      
      return Math.round(total - (total * discount));
    };

    const CartProviderValue = {
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotal,
      getDiscountedTotal,
      selectedCourse,
      setSelectedCourse,
      openModal: () => setModalVisible(true),
      closeModal: () => setModalVisible(false)
    };

    const QuoteProviderValue = {
      quoteRequested,
      setQuoteRequested
    };

    return (
      <CartContext.Provider value={CartProviderValue}>
        <QuoteContext.Provider value={QuoteProviderValue}>
          <NavigationContainer>
            <Drawer.Navigator 
              drawerContent={(props) => <CustomDrawerContent {...props} />}
              screenOptions={{
                headerShown: false,
                drawerStyle: {
                  width: 300,
                },
              }}
            >
              <Drawer.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
            </Drawer.Navigator>

            {/* Course Details Modal */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={COLORS.textDark} />
                  </TouchableOpacity>
                  
                  {selectedCourse && (
                    <ScrollView>
                      <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
                      <Text style={styles.modalDuration}>{selectedCourse.duration} | {selectedCourse.price}</Text>
                      <Text style={styles.modalPurpose}>{selectedCourse.purpose}</Text>
                      
                      <Text style={styles.modalSubtitle}>Course Content:</Text>
                      {selectedCourse.content.map((item, index) => (
                        <Text key={index} style={styles.modalContentItem}>• {item}</Text>
                      ))}
                      
                      <View style={styles.modalActions}>
                        <TouchableOpacity 
                          style={styles.modalAddToCartBtn}
                          onPress={() => {
                            addToCart(selectedCourse);
                            setModalVisible(false);
                            Alert.alert('Added to Cart', `${selectedCourse.title} has been added to your cart`);
                          }}
                        >
                          <Text style={styles.modalAddToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.backToCoursesBtn}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.backToCoursesText}>Back to Courses</Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  )}
                </View>
              </View>
            </Modal>
          </NavigationContainer>
        </QuoteContext.Provider>
      </CartContext.Provider>
    );
  }

  const styles = StyleSheet.create({
    // New logo styles
    headerLogoImage: {
      width: 40,
      height: 40,
      marginRight: 10,
    },
    drawerLogo: {
      width: 40,
      height: 40,
      marginRight: 12,
    },
    heroLogo: {
      width: 80,
      height: 80,
      marginBottom: 20,
    },
    footerLogo: {
      width: 60,
      height: 60,
      marginBottom: 10,
    },

    // Enhanced Header Styles
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray,
    },
    headerLeft: {
      width: 40,
    },
    headerRight: {
      width: 40,
      alignItems: 'flex-end',
    },
    menuButton: {
      padding: 8,
    },
    backButton: {
      padding: 8,
    },
    homeButton: {
      padding: 8,
    },
    headerLogo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerLogoText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
    },

    // Quick Navigation Styles
    quickNavSection: {
      padding: 30,
      backgroundColor: COLORS.white,
    },
    quickNavCards: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    quickNavCard: {
      flex: 1,
      backgroundColor: COLORS.lightBlue,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    quickNavText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      textAlign: 'center',
    },

    // Enhanced Cart Styles
    browseCoursesEmptyBtn: {
      backgroundColor: COLORS.turquoise,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    browseCoursesEmptyText: {
      color: COLORS.white,
      fontWeight: 'bold',
    },
    continueShoppingBtn: {
      backgroundColor: COLORS.blue,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    continueShoppingText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Enhanced Checkout Styles
    backToCartBtn: {
      backgroundColor: COLORS.gray,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    backToCartText: {
      color: COLORS.textDark,
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Drawer Styles
    drawerContainer: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    drawerHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    companyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
    },
    companyTagline: {
      fontSize: 14,
      color: COLORS.textDark,
    },
    drawerItems: {
      flex: 1,
      paddingVertical: 20,
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    drawerItemText: {
      fontSize: 16,
      marginLeft: 12,
      color: COLORS.textDark,
    },
    drawerFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: COLORS.gray,
    },
    footerText: {
      fontSize: 12,
      color: COLORS.textDark,
      marginBottom: 12,
    },
    socialIcons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    // Home Screen Styles
    scrollView: {
      flex: 1,
    },
    heroBanner: {
      backgroundColor: COLORS.lightBlue,
      padding: 30,
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      textAlign: 'center',
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 16,
      color: COLORS.textDark,
      textAlign: 'center',
      marginBottom: 30,
    },
    heroButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    getQuoteBtn: {
      backgroundColor: COLORS.turquoise,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    getQuoteText: {
      color: COLORS.white,
      fontWeight: 'bold',
    },
    browseCoursesBtn: {
      backgroundColor: COLORS.blue,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    browseCoursesText: {
      color: COLORS.white,
      fontWeight: 'bold',
    },
    coursesSection: {
      padding: 30,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 16,
      color: COLORS.textDark,
      textAlign: 'center',
      marginBottom: 20,
    },
    viewAllBtn: {
      backgroundColor: COLORS.turquoise,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
    },
    viewAllBtnText: {
      color: COLORS.white,
      fontWeight: 'bold',
    },
    footer: {
      backgroundColor: COLORS.lightBlue,
      padding: 30,
      alignItems: 'center',
    },
    footerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 8,
    },
    footerTagline: {
      fontSize: 16,
      color: COLORS.textDark,
      marginBottom: 20,
    },
    footerSocials: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 20,
    },
    copyright: {
      fontSize: 12,
      color: COLORS.textDark,
      textAlign: 'center',
    },

    // Courses Screen Styles
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      backgroundColor: COLORS.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.gray,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      color: COLORS.textDark,
    },
    tabContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: COLORS.gray,
    },
    tabBtnActive: {
      backgroundColor: COLORS.turquoise,
    },
    tabText: {
      color: COLORS.textDark,
    },
    tabTextActive: {
      color: COLORS.white,
      fontWeight: 'bold',
    },
    coursesList: {
      padding: 16,
    },
    noResults: {
      alignItems: 'center',
      padding: 40,
    },
    noResultsText: {
      marginTop: 12,
      color: COLORS.textDark,
      textAlign: 'center',
    },

    // Course Card Styles
    courseCard: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    courseImageContainer: {
      position: 'relative',
    },
    courseIcon: {
      position: 'absolute',
      top: 12,
      left: 12,
      zIndex: 2,
      backgroundColor: COLORS.turquoise,
      padding: 8,
      borderRadius: 8,
    },
    courseImage: {
      width: '100%',
      height: 150,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    addToCartBtn: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: COLORS.blue,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      zIndex: 2,
    },
    addToCartText: {
      color: COLORS.white,
      fontSize: 12,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    courseInfo: {
      padding: 16,
    },
    courseTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 4,
    },
    courseDetails: {
      fontSize: 14,
      color: COLORS.textDark,
      marginBottom: 4,
    },
    coursePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.turquoise,
      marginBottom: 12,
    },
    learnMoreBtn: {
      backgroundColor: COLORS.turquoise,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
    },
    learnMoreText: {
      color: COLORS.white,
      fontWeight: 'bold',
    },

    // Cart Screen Styles
    cartContainer: {
      flexGrow: 1,
      padding: 16,
    },
    cartTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 20,
      textAlign: 'center',
    },
    emptyCart: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyCartText: {
      marginTop: 12,
      fontSize: 16,
      color: COLORS.textDark,
    },
    cartItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLORS.gray,
    },
    cartItemInfo: {
      flex: 1,
    },
    cartItemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 4,
    },
    cartItemPrice: {
      fontSize: 14,
      color: COLORS.turquoise,
      fontWeight: 'bold',
    },
    removeBtn: {
      padding: 8,
    },
    cartSummary: {
      backgroundColor: COLORS.lightBlue,
      padding: 16,
      borderRadius: 8,
      marginTop: 20,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: COLORS.textDark,
    },
    summaryValue: {
      fontSize: 14,
      color: COLORS.textDark,
      fontWeight: 'bold',
    },
    discountValue: {
      fontSize: 14,
      color: '#cc0000',
      fontWeight: 'bold',
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: COLORS.gray,
      paddingTop: 8,
      marginTop: 4,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.turquoise,
    },
    discountPolicy: {
      backgroundColor: COLORS.white,
      padding: 16,
      borderRadius: 8,
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.gray,
    },
    policyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 8,
    },
    policyText: {
      fontSize: 14,
      color: COLORS.textDark,
      marginBottom: 8,
      lineHeight: 20,
    },
    policyItem: {
      fontSize: 14,
      color: COLORS.textDark,
      marginBottom: 4,
      lineHeight: 20,
    },
    confirmPayBtn: {
      backgroundColor: COLORS.turquoise,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    confirmPayText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Checkout Screen Styles
    checkoutContainer: {
      flexGrow: 1,
      padding: 16,
    },
    checkoutTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 2,
      borderColor: COLORS.darkBlue,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: COLORS.white,
      marginBottom: 16,
      color: COLORS.textDark,
    },
    bankingSection: {
      backgroundColor: COLORS.lightBlue,
      padding: 20,
      borderRadius: 8,
      marginTop: 20,
      marginBottom: 20,
    },
    bankingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.textDark,
      marginBottom: 12,
    },
    bankingInfo: {
      gap: 8,
    },
    bankingItem: {
      fontSize: 14,
      color: COLORS.textDark,
      lineHeight: 20,
    },
    bankingLabel: {
      fontWeight: '600',
    },
    bankingNote: {
      fontSize: 12,
      color: COLORS.textDark,
      fontStyle: 'italic',
      marginTop: 12,
      lineHeight: 16,
    },
    payNowBtn: {
      backgroundColor: COLORS.turquoise,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    disabledBtn: {
      backgroundColor: COLORS.gray,
    },
    payNowBtnText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Contact Screen Styles
    contactContainer: {
      flexGrow: 1,
      padding: 16,
    },
    contactTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 20,
      textAlign: 'center',
    },
    contactInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
      padding: 16,
      backgroundColor: COLORS.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.gray,
    },
    contactText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: COLORS.textDark,
      lineHeight: 24,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      padding: 16,
      backgroundColor: COLORS.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.gray,
    },
    contactLinkText: {
      marginLeft: 12,
      fontSize: 16,
      color: COLORS.blue,
    },
    socialSection: {
      marginTop: 20,
      marginBottom: 20,
    },
    socialTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 12,
      textAlign: 'center',
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    socialButton: {
      backgroundColor: COLORS.turquoise,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
    },
    socialButtonText: {
      color: COLORS.white,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    mapPlaceholder: {
      height: 200,
      backgroundColor: COLORS.gray,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 20,
    },
    mapText: {
      marginTop: 8,
      color: COLORS.textDark,
    },

    // New styles for quote functionality
    quoteBanner: {
      backgroundColor: COLORS.turquoise,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    quoteBannerText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 8,
    },
    quoteBannerSubtext: {
      color: COLORS.white,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 4,
      opacity: 0.9,
    },
    quoteForm: {
      backgroundColor: COLORS.lightBlue,
      padding: 20,
      borderRadius: 12,
      marginTop: 20,
      marginBottom: 20,
    },
    quoteFormTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 16,
      textAlign: 'center',
    },
    quoteInput: {
      borderWidth: 1,
      borderColor: COLORS.darkBlue,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: COLORS.white,
      marginBottom: 12,
      color: COLORS.textDark,
    },
    quoteTextArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    submitQuoteBtn: {
      backgroundColor: COLORS.turquoise,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    submitQuoteText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCard: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 20,
      margin: 20,
      maxHeight: '80%',
      minWidth: '90%',
    },
    closeButton: {
      alignSelf: 'flex-end',
      padding: 4,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 8,
    },
    modalDuration: {
      fontSize: 16,
      color: COLORS.turquoise,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    modalPurpose: {
      fontSize: 16,
      color: COLORS.textDark,
      lineHeight: 24,
      marginBottom: 16,
    },
    modalSubtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.darkBlue,
      marginBottom: 12,
    },
    modalContentItem: {
      fontSize: 14,
      color: COLORS.textDark,
      lineHeight: 20,
      marginBottom: 8,
    },
    modalActions: {
      marginTop: 20,
      gap: 12,
    },
    modalAddToCartBtn: {
      backgroundColor: COLORS.blue,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalAddToCartText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    backToCoursesBtn: {
      backgroundColor: COLORS.gray,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    backToCoursesText: {
      color: COLORS.textDark,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

