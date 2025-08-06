// app/product/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

type Product = {
  id: string;
  name: string;
  brand: string;
  regular_price: number;
  sale_price?: number;
  image: string;
  category_id: string;
  stock: number;
  rating: number;
  is_featured: boolean;
  description: string;
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.18.84:8000/api/tienda/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        // Fallback con producto demo
        setProduct(getDemoProduct(id!));
      }
    } catch (error) {
      console.log('Error fetching product:', error);
      setProduct(getDemoProduct(id!));
    } finally {
      setLoading(false);
    }
  };

  const getDemoProduct = (productId: string): Product => {
    const demoProducts = [
      {
        id: '1',
        name: 'Bi Pro Vanilla 2lb',
        brand: 'UNS',
        regular_price: 349000,
        image: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=BCAA',
        category_id: '1',
        stock: 50,
        rating: 4.8,
        is_featured: true,
        description: 'BCAA´s matrix & silk amino acid'
      },
      {
        id: '2',
        name: 'Platinum Creatina',
        brand: 'MUSCLETECH',
        regular_price: 490000,
        image: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=BCAA',
        category_id: '4',
        stock: 30,
        rating: 4.6,
        is_featured: false,
        description: 'BCAA´s matrix & silk amino acid'
      },
      {
        id: '3',
        name: 'Omega 3 Procience',
        brand: 'PROCIENCE',
        regular_price: 79900,
        image: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=BCAA',
        category_id: '6',
        stock: 40,
        rating: 4.7,
        is_featured: true,
        description: 'BCAA´s matrix & silk amino acid'
      },
      {
        id: '4',
        name: 'Vegan Protein 2lb',
        brand: 'GARDEN OF LIFE',
        regular_price: 324900,
        image: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=BCAA',
        category_id: '1',
        stock: 25,
        rating: 4.5,
        is_featured: false,
        description: 'BCAA´s matrix & silk amino acid'
      },
      {
        id: '5',
        name: 'BCAA Powder',
        brand: 'OPTIMUM NUTRITION',
        regular_price: 25990,
        image: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=BCAA',
        category_id: '3',
        stock: 60,
        rating: 4.9,
        is_featured: true,
        description: 'BCAA´s matrix & silk amino acid'
      },
      {
        id: '6',
        name: 'Protein Shake',
        brand: 'PREMIUM',
        regular_price: 55990,
        image: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=BCAA',
        category_id: '1',
        stock: 20,
        rating: 4.3,
        is_featured: false,
        description: 'BCAA´s matrix & silk amino acid'
      },
    ];
    
    return demoProducts.find(p => p.id === productId) || demoProducts[0];
  };

  const addToCart = async () => {
    if (!product) return;

    try {
      const response = await fetch('http://192.168.18.84:8000/api/carrito', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Producto agregado al carrito', [
          { text: 'Continuar comprando', onPress: () => router.back() },
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Error', 'No se pudo agregar el producto al carrito');
      }
    } catch (error) {
      console.log('Error adding to cart:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
  const displayPrice = product.sale_price || product.regular_price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.regular_price - product.sale_price!) / product.regular_price) * 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle producto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productSubtitle}>tabletas recubiertas de healthy sports</Text>
          
          <Text style={styles.productPrice}>${product.regular_price.toLocaleString('es-CO')}</Text>

          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletText}>• Contiene antioxidantes elementales y no</Text>
            <Text style={styles.bulletText}>• minerales elementos de vitaminas y elementos</Text>
            <Text style={styles.bulletText}>• Aminoacidos de calidad</Text>
            <Text style={styles.bulletText}>• No contiene azúcar</Text>
            <Text style={styles.bulletText}>• Solo proteína natural, azúcar 3500mg</Text>
          </View>

          {/* Cantidad */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.addToCartButton, product.stock === 0 && styles.disabledButton]}
          onPress={addToCart}
          disabled={product.stock === 0}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#fff',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  productImage: {
    width: 180,
    height: 240,
    resizeMode: 'contain',
  },
  productInfo: {
    backgroundColor: '#fff',
    padding: 20,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  bulletPoints: {
    marginBottom: 30,
  },
  bulletText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    lineHeight: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 30,
  },
  bottomActions: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  addToCartButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
