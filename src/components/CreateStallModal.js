import React, { memo } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreateStallModal = memo(
  ({
    visible,
    onClose,
    onSubmit,
    isSubmitting,
    values,
    onChangeValues,
    vendors,
    selectedVendorId,
    setShowVendorModal,
  }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create New Stall</Text>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stall Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter stall number"
                placeholderTextColor="#8F92A1"
                value={values.stallNumber}
                onChangeText={text => onChangeValues('stallNumber', text)}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stall Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter stall name"
                placeholderTextColor="#8F92A1"
                value={values.stallName}
                onChangeText={text => onChangeValues('stallName', text)}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description"
                placeholderTextColor="#8F92A1"
                value={values.description}
                onChangeText={text => onChangeValues('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vendor</Text>
              <TouchableOpacity
                style={[
                  styles.vendorSelector,
                  selectedVendorId && styles.vendorSelectorActive,
                ]}
                onPress={() => setShowVendorModal(true)}
              >
                <View style={styles.vendorSelectorContent}>
                  <Feather
                    name="user"
                    size={20}
                    color={selectedVendorId ? '#FF724C' : '#8F92A1'}
                    style={styles.vendorIcon}
                  />
                  <Text
                    style={[
                      styles.vendorSelectorText,
                      selectedVendorId && styles.vendorSelectorTextActive,
                    ]}
                  >
                    {selectedVendorId
                      ? `${vendors.find(v => v.id === selectedVendorId)?.name || 'Selected Vendor'}`
                      : 'Select Vendor (Optional)'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#8F92A1" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.createButton,
                (isSubmitting ||
                  !values.stallName.trim() ||
                  !values.stallNumber.trim()) &&
                  styles.disabledButton,
              ]}
              onPress={onSubmit}
              disabled={
                isSubmitting ||
                !values.stallName.trim() ||
                !values.stallNumber.trim()
              }
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.createButtonText}>Create Stall</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ),
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width - 40,
    maxHeight: '80%',
    backgroundColor: '#1E2238',
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  vendorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  vendorSelectorActive: {
    backgroundColor: 'rgba(255, 114, 76, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 114, 76, 0.3)',
  },
  vendorSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vendorIcon: {
    marginRight: 10,
  },
  vendorSelectorText: {
    color: '#8F92A1',
    fontSize: 16,
  },
  vendorSelectorTextActive: {
    color: '#FF724C',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#FF724C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 114, 76, 0.5)',
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateStallModal;
