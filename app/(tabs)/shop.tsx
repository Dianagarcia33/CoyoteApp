// app/(tabs)/shop.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

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

type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
};

export default function Shop() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.18.84:8000/api/tienda', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      } else {
        // Fallback con productos demo
        setProducts(getDemoProducts());
      }
    } catch (error) {
      console.log('Error fetching products:', error);
      setProducts(getDemoProducts());
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.18.84:8000/api/carrito', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.log('Error fetching cart:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const getDemoProducts = (): Product[] => [
    {
      id: '1',
      name: 'Bi Pro Vanilla 2lb',
      brand: 'UNS',
      regular_price: 349.00,
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=Bi+Pro',
      category_id: '1',
      stock: 50,
      rating: 4.8,
      is_featured: true,
      description: 'Proteína aislada de suero sabor vainilla'
    },
    {
      id: '2',
      name: 'Platinum Creatina',
      brand: 'MUSCLETECH',
      regular_price: 490.00,
      image: 'https://via.placeholder.com/150x150/000000/ffffff?text=Platinum',
      category_id: '4',
      stock: 30,
      rating: 4.6,
      is_featured: false,
      description: 'Creatina monohidrato premium'
    },
    {
      id: '3',
      name: 'Omega 3 Procience',
      brand: 'PROCIENCE',
      regular_price: 79.90,
      image: 'https://via.placeholder.com/150x150/4169E1/ffffff?text=Omega+3',
      category_id: '6',
      stock: 40,
      rating: 4.7,
      is_featured: true,
      description: 'Ácidos grasos omega 3'
    },
    {
      id: '4',
      name: 'Vegan Protein 2lb',
      brand: 'GARDEN OF LIFE',
      regular_price: 324.90,
      image: 'https://via.placeholder.com/150x150/32CD32/000000?text=Vegan',
      category_id: '1',
      stock: 25,
      rating: 4.5,
      is_featured: false,
      description: 'Proteína vegana orgánica'
    },
    {
      id: '5',
      name: 'BCAA Powder',
      brand: 'OPTIMUM NUTRITION',
      regular_price: 25.99,
      image: 'https://via.placeholder.com/150x150/87CEEB/000000?text=BCAA',
      category_id: '3',
      stock: 60,
      rating: 4.9,
      is_featured: true,
      description: 'Aminoácidos ramificados en polvo'
    },
    {
      id: '6',
      name: 'Protein Shake',
      brand: 'PREMIUM',
      regular_price: 55.99,
      image: 'https://via.placeholder.com/150x150/DEB887/000000?text=Shake',
      category_id: '1',
      stock: 20,
      rating: 4.3,
      is_featured: false,
      description: 'Batido de proteína listo para tomar'
    },
  ];

  const renderProduct = ({ item }: { item: Product }) => {
    const hasDiscount = item.sale_price && item.sale_price < item.regular_price;
    const displayPrice = item.sale_price || item.regular_price;
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {hasDiscount && (
          <View style={styles.discountDot} />
        )}
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>${displayPrice.toFixed(0)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const CartModal = () => (
    <Modal
      visible={showCart}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.cartModal}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Mi Carrito</Text>
          <TouchableOpacity onPress={() => setShowCart(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.product.name}</Text>
                  <Text style={styles.cartItemPrice}>${item.product.sale_price || item.product.regular_price}</Text>
                  <Text style={styles.cartItemQuantity}>Cantidad: {item.quantity}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CartModal />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="storefront-outline" size={24} color="#333" />
          <Text style={styles.title}>Tienda</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Categoría</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Precio</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Lista de productos */}
      <View style={styles.productsContainer}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    paddingTop: Platform.OS === "ios" ? 50 : 35,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  title: { 
    fontSize: 20, 
    fontWeight: '600',
    color: '#2c3e50',
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },

  // Categories
  categoriesSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },

  // Products
  featuredSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 8,
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  productsSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  productList: { 
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  // Product Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '48%',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffc107',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  productImage: { 
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    padding: 6,
    alignItems: 'center',
    paddingBottom: 10,
  },
  brandText: {
    fontSize: 10,
    color: '#6c757d',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: { 
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 4,
  },
  priceContainer: {
    marginBottom: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#6c757d',
    textDecorationLine: 'line-through',
  },
  productPrice: { 
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  stockContainer: {
    marginBottom: 8,
  },
  stockText: {
    fontSize: 11,
    color: '#28a745',
    fontWeight: '500',
  },
  cartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cartButtonDisabled: {
    backgroundColor: '#f8f9fa',
    opacity: 0.5,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },

  // Cart Modal
  cartModal: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cartItemQuantity: {
    fontSize: 12,
    color: '#6c757d',
  },

  // New layout styles
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    gap: 15,
  },
  filterButton: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    width: (width - 50) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  discountDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
