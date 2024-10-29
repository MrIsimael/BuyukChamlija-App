import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

const Checkout = ({ navigation, route }) => {
  const { items } = route.params;
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  const formatPrice = price => {
    return `R${(price || 0).toFixed(2)}`;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatCardNumber = text => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = text => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const generateTransactionId = () => {
    return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const saveReceiptToFirebase = async receiptData => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const receipt = {
      userId: user.uid,
      transactionId: receiptData.transactionId,
      items: receiptData.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        stallName: item.stallName,
        stallNumber: item.stallNumber,
      })),
      totalAmount: receiptData.totalAmount,
      paymentMethod: {
        type: 'card',
        lastFourDigits: cardNumber.slice(-4),
        cardholderName: cardName,
      },
      timestamp: serverTimestamp(),
      status: 'completed',
    };

    try {
      const docRef = await addDoc(collection(db, 'receipts'), receipt);
      console.log('Receipt saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving receipt:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid 3-digit CVV');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const txnId = generateTransactionId();
      const receipt = {
        transactionId: txnId,
        items: items,
        totalAmount: calculateTotal(),
        date: new Date(),
      };

      // Save receipt to Firebase
      await saveReceiptToFirebase(receipt);

      setTransactionId(txnId);
      setReceiptData(receipt);
      setShowReceipt(true);
    } catch (error) {
      console.error('Payment or receipt saving failed:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const Receipt = () => (
    <Modal
      visible={showReceipt}
      transparent
      animationType="fade"
      onRequestClose={() => navigation.navigate('HomeDrawer')}
    >
      <View style={styles.modalContainer}>
        <View style={styles.receiptContainer}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>Payment Receipt</Text>
            <Feather name="check-circle" size={40} color="#4CAF50" />
          </View>

          <View style={styles.receiptDivider} />

          <Text style={styles.receiptText}>
            Transaction ID: {transactionId}
          </Text>
          <Text style={styles.receiptText}>Date: {getCurrentDate()}</Text>
          <Text style={styles.receiptText}>
            Card: **** **** **** {cardNumber.slice(-4)}
          </Text>

          <View style={styles.receiptDivider} />

          <Text style={styles.receiptSubtitle}>Items:</Text>
          {items.map(item => (
            <View key={item.id} style={styles.receiptItem}>
              <Text style={styles.receiptItemText}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={styles.receiptItemText}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.receiptDivider} />

          <View style={styles.receiptTotal}>
            <Text style={styles.receiptTotalText}>Total Paid</Text>
            <Text style={styles.receiptTotalAmount}>
              {formatPrice(calculateTotal())}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('HomeDrawer')}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {item.quantity} x {formatPrice(item.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#8F92A1"
            value={cardNumber}
            onChangeText={text => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#8F92A1"
                value={expiryDate}
                onChangeText={text => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#8F92A1"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="JOHN DOE"
            placeholderTextColor="#8F92A1"
            value={cardName}
            onChangeText={setCardName}
            autoCapitalize="characters"
          />
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total to Pay</Text>
          <Text style={styles.totalAmount}>
            {formatPrice(calculateTotal())}
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Pay Now</Text>
              <Feather name="credit-card" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Receipt />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2C41',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 114, 76, 0.25)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'rgba(255, 114, 76, 0.15)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    color: 'white',
  },
  itemDetails: {
    fontSize: 16,
    color: '#FF724C',
    fontWeight: 'bold',
  },
  inputLabel: {
    color: '#8F92A1',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  totalSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#8F92A1',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  checkoutButton: {
    backgroundColor: '#FF724C',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  receiptContainer: {
    backgroundColor: '#2A2C41',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 114, 76, 0.3)',
    marginVertical: 16,
  },
  receiptText: {
    color: '#8F92A1',
    fontSize: 16,
    marginBottom: 8,
  },
  receiptSubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptItemText: {
    color: '#8F92A1',
    fontSize: 16,
  },
  receiptTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  receiptTotalText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  receiptTotalAmount: {
    color: '#FF724C',
    fontSize: 24,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#FF724C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;
