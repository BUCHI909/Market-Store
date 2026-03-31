// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaPlus,
  FaBell,
  FaStar,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaEye,
  FaDollarSign,
  FaArrowUp,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSearch,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaRegComment,
  FaAward,
  FaFilter
} from "react-icons/fa";
import {
  Table,
  Badge,
  Button,
  Form,
  Spinner,
  Card,
  Row,
  Col,
  Dropdown,
  ProgressBar,
  Tab,
  Tabs,
  Alert,
  Toast,
  ToastContainer,
  Modal,
  InputGroup,
  Pagination
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProducts, createProduct, deleteProduct, updateProduct, getOrders, updateOrderStatus, getReviews } from "../utils/api.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    stock: "",
    category: "",
    sku: "",
    discount: "",
    tags: ""
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSales: 0,
    averageRating: 0,
    weeklySales: [0, 0, 0, 0, 0, 0, 0],
    monthlySales: Array(12).fill(0),
    topProducts: [],
    lowStockItems: 0,
    outOfStockItems: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received!", time: "2 min ago", read: false, type: "order" },
    { id: 2, message: "Product review from customer", time: "1 hour ago", read: false, type: "review" },
    { id: 3, message: "Low stock alert: Wireless Headphones", time: "3 hours ago", read: true, type: "alert" },
    { id: 4, message: "Payment received for order #12345", time: "5 hours ago", read: true, type: "payment" },
    { id: 5, message: "New customer signed up", time: "yesterday", read: true, type: "customer" }
  ]);
  const [analyticsData] = useState({
    topReferrers: [
      { source: "Google", visits: 1250, percentage: 45 },
      { source: "Facebook", visits: 580, percentage: 21 },
      { source: "Instagram", visits: 420, percentage: 15 },
      { source: "Direct", visits: 380, percentage: 14 },
      { source: "Twitter", visits: 150, percentage: 5 }
    ],
    topCountries: [
      { country: "Nigeria", visits: 3420, percentage: 68 },
      { country: "Ghana", visits: 890, percentage: 18 },
      { country: "Kenya", visits: 450, percentage: 9 },
      { country: "South Africa", visits: 250, percentage: 5 }
    ],
    deviceBreakdown: { mobile: 58, desktop: 32, tablet: 10 },
    browserBreakdown: { chrome: 65, firefox: 15, safari: 12, edge: 8 },
    hourlyTraffic: Array(24).fill(0).map(() => Math.floor(Math.random() * 100) + 20)
  });

  const navigate = useNavigate();

  // Helper function to calculate estimated delivery date
  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery
    return deliveryDate.toLocaleDateString();
  };

  // Chart Data
  const salesChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales (₦)",
        data: stats.weeklySales,
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const monthlyChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales (₦)",
        data: stats.monthlySales,
        borderColor: "#48bb78",
        backgroundColor: "rgba(72, 187, 120, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categoryChartData = {
    labels: ["Electronics", "Fashion", "Home", "Books", "Others"],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: ["#667eea", "#48bb78", "#ed64a6", "#fbbf24", "#9f7aea"],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  const deviceChartData = {
    labels: ["Mobile", "Desktop", "Tablet"],
    datasets: [
      {
        data: [analyticsData.deviceBreakdown.mobile, analyticsData.deviceBreakdown.desktop, analyticsData.deviceBreakdown.tablet],
        backgroundColor: ["#4299e1", "#48bb78", "#ed64a6"],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  const hourlyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Visitors",
        data: analyticsData.hourlyTraffic,
        backgroundColor: "rgba(102, 126, 234, 0.6)",
        borderRadius: 4
      }
    ]
  };

  useEffect(() => {
    fetchAllData();
    generateMockData();
    startMockNotifications();
  }, []);

  const generateMockData = () => {
    const weekly = [45000, 52000, 48000, 61000, 75000, 82000, 68000];
    setStats(prev => ({ ...prev, weeklySales: weekly }));
    
    const monthly = [120000, 135000, 148000, 162000, 185000, 210000, 235000, 258000, 275000, 295000, 310000, 335000];
    setStats(prev => ({ ...prev, monthlySales: monthly }));
  };

  const startMockNotifications = () => {
    const interval = setInterval(() => {
      const mockMessages = [
        "New order #" + Math.floor(Math.random() * 10000) + " received!",
        "Customer left a 5-star review!",
        "Product viewed 10 times in the last hour",
        "New customer from Lagos just visited your store"
      ];
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      setNotifications(prev => [
        { id: Date.now(), message: randomMessage, time: "just now", read: false, type: "order" },
        ...prev.slice(0, 9)
      ]);
      setShowToast(true);
      setToastMessage(randomMessage);
      setToastType("info");
      setTimeout(() => setShowToast(false), 3000);
    }, 60000);
    return () => clearInterval(interval);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchReviews()
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
        const lowStock = data.filter(p => p.stock > 0 && p.stock < 5).length;
        const outOfStock = data.filter(p => p.stock === 0).length;
        setStats(prev => ({ 
          ...prev, 
          totalProducts: data.length,
          lowStockItems: lowStock,
          outOfStockItems: outOfStock,
          topProducts: data.slice(0, 5).map(p => ({ ...p, sales: Math.floor(Math.random() * 100) + 10 }))
        }));
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      if (Array.isArray(data)) {
        setRecentOrders(data);
        const total = data.length;
        const revenue = data.reduce((sum, order) => sum + (order.total_amount || order.price || 0), 0);
        const pending = data.filter(o => o.status === 'pending' || o.status === 'Pending').length;
        const completed = data.filter(o => o.status === 'completed' || o.status === 'Completed' || o.status === 'delivered').length;
        const averageValue = completed > 0 ? revenue / completed : 0;
        const today = new Date().toDateString();
        const todaySales = data.filter(o => new Date(o.created_at).toDateString() === today).reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);
        const weekSales = data.filter(o => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(o.created_at) >= weekAgo;
        }).reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);
        const monthSales = data.filter(o => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(o.created_at) >= monthAgo;
        }).reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalOrders: total,
          totalRevenue: revenue,
          pendingOrders: pending,
          completedOrders: completed,
          averageOrderValue: averageValue,
          todaySales: todaySales,
          weekSales: weekSales,
          monthSales: monthSales,
          conversionRate: (completed / (total || 1)) * 100,
          totalCustomers: Math.floor(Math.random() * 500) + 100
        }));
        
        const weeklyData = [0, 0, 0, 0, 0, 0, 0];
        data.forEach(order => {
          if (order.created_at) {
            const day = new Date(order.created_at).getDay();
            weeklyData[day] += (order.total_amount || order.price || 0);
          }
        });
        setStats(prev => ({ ...prev, weeklySales: weeklyData }));
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setRecentOrders([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getReviews();
      let reviewsData = [];
      if (Array.isArray(data)) {
        reviewsData = data;
      } else if (data?.data && Array.isArray(data.data)) {
        reviewsData = data.data;
      }
      setReviews(reviewsData);
      const avgRating = reviewsData.length > 0 
        ? reviewsData.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewsData.length 
        : 0;
      setStats(prev => ({ ...prev, averageRating: avgRating.toFixed(1) }));
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setReviews([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    setAdding(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("stock", formData.stock || 10);
      data.append("category", formData.category || "General");
      data.append("sku", formData.sku || "");
      data.append("discount", formData.discount || 0);
      if (formData.image) data.append("image", formData.image);

      if (formData.id) {
        const res = await updateProduct(formData.id, data);
        setProducts(products.map(p => p.id === formData.id ? res.data : p));
        setToastMessage("Product updated successfully!");
      } else {
        const res = await createProduct(data);
        setProducts([res.data, ...products]);
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
        setToastMessage("Product added successfully!");
      }

      setFormData({ name: "", price: "", description: "", image: null, id: null, stock: "", category: "", sku: "", discount: "", tags: "" });
      setPreviewImage(null);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Create/Edit product error:", err);
      setToastMessage("Failed to add or update product");
      setToastType("danger");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setAdding(false);
      setShowModal(false);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: null,
      stock: product.stock || "",
      category: product.category || "",
      sku: product.sku || "",
      discount: product.discount || "",
      tags: product.tags || "",
      id: product.id,
    });
    setPreviewImage(product.image ? `http://localhost:5000${product.image}` : null);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteId);
      setProducts(products.filter(p => p.id !== deleteId));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      setToastMessage("Product deleted successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setToastMessage("Failed to delete product");
      setToastType("danger");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status });
      setRecentOrders(recentOrders.map(o => o.id === orderId ? { ...o, status } : o));
      setToastMessage(`Order #${orderId} status updated to ${status}`);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowOrderModal(false);
    } catch (err) {
      console.error("Update order error:", err);
      setToastMessage("Failed to update order status");
      setToastType("danger");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleExportData = () => {
    const data = { products, orders: recentOrders, reviews, stats, analyticsData, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketsphere_export_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage("Data exported successfully!");
    setToastType("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(<FaStar key={i} className={i <= fullStars ? "text-warning" : "text-secondary"} size={14} />);
    }
    return stars;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'warning', icon: <FaClock size={12} className="me-1" />, text: 'Pending' },
      'processing': { bg: 'info', icon: <FaSpinner size={12} className="me-1" />, text: 'Processing' },
      'shipped': { bg: 'primary', icon: <FaTruck size={12} className="me-1" />, text: 'Shipped' },
      'delivered': { bg: 'success', icon: <FaCheckCircle size={12} className="me-1" />, text: 'Delivered' },
      'completed': { bg: 'success', icon: <FaCheckCircle size={12} className="me-1" />, text: 'Completed' },
      'cancelled': { bg: 'danger', icon: <FaTimesCircle size={12} className="me-1" />, text: 'Cancelled' }
    };
    const s = statusMap[status?.toLowerCase()] || { bg: 'secondary', icon: <FaClock size={12} className="me-1" />, text: status || 'Pending' };
    return <Badge bg={s.bg} className="d-flex align-items-center gap-1" style={{ display: "inline-flex", padding: "6px 12px", borderRadius: "20px" }}>{s.icon} {s.text}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
  };

  // Filter and paginate products
  const filteredProducts = products
    .filter(p => filterCategory === "all" || p.category === filterCategory)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        default: return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8f9fa'
      }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#f8f9fa',
      minHeight: '100vh',
      width: '100%',
      padding: '0',
      paddingBottom: '80px'
    }}>
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastType}>
          <Toast.Header>
            <strong className="me-auto">MarketSphere</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className={toastType === "success" ? "text-success" : "text-danger"}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Welcome Section - UPDATED: Removed "Seller Dashboard" text */}
      <div style={{ 
        padding: "20px 30px",
        background: "white",
        borderRadius: "16px",
        margin: "20px 30px 0 30px",
        border: "1px solid #e9ecef"
      }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0, color: "#2d3748" }}>
              {getGreeting()}, {user?.name?.split(' ')[0] || "Seller"}! 👋
            </h1>
            <p style={{ fontSize: "1rem", color: "#718096", marginTop: "8px" }}>
              Welcome to your dashboard • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="d-flex gap-2">
            {/* Quick Stats Badge */}
            <div className="d-none d-md-flex align-items-center me-2 px-3 py-2 bg-light rounded-pill">
              <FaChartLine className="text-primary me-2" />
              <small className="text-muted">Today: {formatCurrency(stats.todaySales)}</small>
            </div>
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm" style={{ borderRadius: "20px" }}>
                <FaBell className="me-1" /> {getUnreadCount() > 0 && <Badge bg="danger" pill style={{ fontSize: "10px", marginLeft: "4px" }}>{getUnreadCount()}</Badge>}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" style={{ width: "320px", maxHeight: "400px", overflowY: "auto" }}>
                <Dropdown.Header className="d-flex justify-content-between">
                  <span>Notifications</span>
                  {getUnreadCount() > 0 && (
                    <Button variant="link" size="sm" onClick={markAllNotificationsRead} style={{ fontSize: "12px", padding: 0 }}>Mark all read</Button>
                  )}
                </Dropdown.Header>
                {notifications.slice(0, 10).map(notif => (
                  <Dropdown.Item key={notif.id} className={!notif.read ? "bg-light" : ""}>
                    <div>
                      <div className="fw-bold">{notif.message}</div>
                      <small className="text-muted">{notif.time}</small>
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="light" size="sm" onClick={handleExportData} style={{ borderRadius: "20px" }}>
              <FaDownload className="me-1" /> Export
            </Button>
            <Button variant="light" size="sm" onClick={handlePrintReport} style={{ borderRadius: "20px" }}>
              <FaPrint className="me-1" /> Print
            </Button>
          </div>
        </div>

        {/* Quick Stats Row - ADDED for better mobile view */}
        <Row className="mt-4 g-3">
          <Col xs={6} md={3}>
            <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3">
              <FaBoxOpen className="text-primary" />
              <div>
                <small className="text-muted d-block">Products</small>
                <strong>{stats.totalProducts}</strong>
              </div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3">
              <FaShoppingCart className="text-success" />
              <div>
                <small className="text-muted d-block">Orders</small>
                <strong>{stats.totalOrders}</strong>
              </div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3">
              <FaStar className="text-warning" />
              <div>
                <small className="text-muted d-block">Rating</small>
                <strong>{stats.averageRating || 0} ★</strong>
              </div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3">
              <FaDollarSign className="text-info" />
              <div>
                <small className="text-muted d-block">Revenue</small>
                <strong>{formatCurrency(stats.totalRevenue)}</strong>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div style={{ padding: "20px 30px" }}>
        {/* Main Stats Cards */}
        <Row className="g-4 mb-4">
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">Total Products</small>
                    <h3 className="fw-bold mb-0">{stats.totalProducts}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <FaBoxOpen size={24} className="text-primary" />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-success"><FaArrowUp size={10} className="me-1" /> +{Math.floor(Math.random() * 20) + 5}% this month</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">Total Orders</small>
                    <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <FaShoppingCart size={24} className="text-warning" />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-warning"><FaClock size={10} className="me-1" /> {stats.pendingOrders} pending</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">Total Revenue</small>
                    <h4 className="fw-bold mb-0">{formatCurrency(stats.totalRevenue)}</h4>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <FaDollarSign size={24} className="text-success" />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-success"><FaArrowUp size={10} className="me-1" /> +12% this month</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">Customer Rating</small>
                    <h3 className="fw-bold mb-0">{stats.averageRating || 0}⭐</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <FaStar size={24} className="text-info" />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-success"><FaAward size={10} className="me-1" /> Top Rated</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Secondary Stats Cards */}
        <Row className="g-3 mb-4">
          <Col xs={4} md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <small className="text-muted">Today's Sales</small>
                <h6 className="mb-0 fw-bold">{formatCurrency(stats.todaySales)}</h6>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <small className="text-muted">This Week</small>
                <h6 className="mb-0 fw-bold">{formatCurrency(stats.weekSales)}</h6>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <small className="text-muted">This Month</small>
                <h6 className="mb-0 fw-bold">{formatCurrency(stats.monthSales)}</h6>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <small className="text-muted">Avg Order</small>
                <h6 className="mb-0 fw-bold">{formatCurrency(stats.averageOrderValue)}</h6>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <small className="text-muted">Conversion</small>
                <h6 className="mb-0 fw-bold">{stats.conversionRate.toFixed(1)}%</h6>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4} md={2}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <small className="text-muted">Customers</small>
                <h6 className="mb-0 fw-bold">{stats.totalCustomers}</h6>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-bold mb-0">Quick Actions</h4>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => setShowModal(true)} style={{ borderRadius: "30px" }}>
              <FaPlus className="me-2" /> Add New Product
            </Button>
            <Button variant="outline-primary" onClick={() => window.open("/shop", "_blank")} style={{ borderRadius: "30px" }}>
              <FaEye className="me-2" /> View Store
            </Button>
            <Button variant="outline-success" onClick={() => window.open("https://wa.me/2349098746971", "_blank")} style={{ borderRadius: "30px" }}>
              <FaWhatsapp className="me-2" /> Support
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" fill>
          {/* Overview Tab */}
          <Tab eventKey="overview" title={<><FaChartLine className="me-2" />Overview</>}>
            <Row className="g-4 mt-2">
              <Col lg={8}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                      <h5 className="fw-bold mb-0">Sales Performance</h5>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant={selectedPeriod === "weekly" ? "primary" : "light"} onClick={() => setSelectedPeriod("weekly")}>Weekly</Button>
                        <Button size="sm" variant={selectedPeriod === "monthly" ? "primary" : "light"} onClick={() => setSelectedPeriod("monthly")}>Monthly</Button>
                      </div>
                    </div>
                    {selectedPeriod === "weekly" ? (
                      <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: true }} height={300} />
                    ) : (
                      <Line data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: true }} height={300} />
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3">Sales by Category</h5>
                    <div style={{ height: "200px" }}>
                      <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                    <div className="mt-3">
                      {["Electronics", "Fashion", "Home", "Books", "Others"].map((cat, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                          <span><span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "2px", background: ["#667eea", "#48bb78", "#ed64a6", "#fbbf24", "#9f7aea"][idx], marginRight: "8px" }}></span>{cat}</span>
                          <span className="fw-bold">{["35%", "25%", "20%", "12%", "8%"][idx]}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mt-2">
              <Col md={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3">Top Selling Products</h5>
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Sales</th>
                            <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                          {stats.topProducts.slice(0, 5).map((p) => (
                            <tr key={p.id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <img src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/32"} width={32} height={32} style={{ objectFit: "cover", borderRadius: "6px" }} />
                                  {p.name}
                                </div>
                              </td>
                              <td>{p.sales || Math.floor(Math.random() * 100) + 10}</td>
                              <td className="fw-bold">{formatCurrency(p.price * (p.sales || 50))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3">Recent Orders</h5>
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Est. Delivery</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.slice(0, 5).map(order => (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.product_name || order.product}</td>
                              <td>{formatCurrency(order.total_amount || order.price || 0)}</td>
                              <td>{getStatusBadge(order.status)}</td>
                              <td><FaCalendarAlt className="me-1" />{getEstimatedDelivery(order.created_at)}</td>
                            </tr>
                          ))}
                          {recentOrders.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center">No orders yet</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {stats.lowStockItems > 0 && (
              <Alert variant="warning" className="mt-4" style={{ borderRadius: "16px" }}>
                <div className="d-flex align-items-center">
                  <FaExclamationTriangle size={24} className="text-warning me-3" />
                  <div>
                    <strong>Low Stock Alert!</strong> {stats.lowStockItems} products are running low on stock. 
                    {stats.outOfStockItems > 0 && ` ${stats.outOfStockItems} are completely out of stock.`}
                  </div>
                </div>
              </Alert>
            )}
          </Tab>

          {/* Products Tab */}
          <Tab eventKey="products" title={<><FaBoxOpen className="me-2" />Products ({products.length})</>}>
            <Card className="border-0 shadow-sm mt-2" style={{ borderRadius: "16px" }}>
              <Card.Body className="p-4">
                <Row className="mb-4">
                  <Col md={4}>
                    <InputGroup>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                      <option value="all">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                      <option value="Books">Books</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                    </Form.Select>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button variant="outline-primary" onClick={() => setShowModal(true)}><FaPlus className="me-1" /> Add</Button>
                  </Col>
                </Row>
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map(p => (
                        <tr key={p.id}>
                          <td><img src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/50"} width={50} height={50} style={{ objectFit: "cover", borderRadius: "10px" }} /></td>
                          <td className="fw-bold">{p.name}</td>
                          <td>{formatCurrency(p.price)}</td>
                          <td><Badge bg={p.stock > 10 ? "success" : p.stock > 0 ? "warning" : "danger"}>{p.stock > 0 ? `${p.stock} left` : "Out"}</Badge></td>
                          <td><Badge bg="light" text="dark">{p.category || "General"}</Badge></td>
                          <td>
                            <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditProduct(p)}><FaEdit /></Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(p.id)}><FaTrash /></Button>
                          </td>
                        </tr>
                      ))}
                      {currentProducts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-5">No products found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum = currentPage;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return <Pagination.Item key={pageNum} active={pageNum === currentPage} onClick={() => setCurrentPage(pageNum)}>{pageNum}</Pagination.Item>;
                      })}
                      <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* Orders Tab */}
          <Tab eventKey="orders" title={<><FaShoppingCart className="me-2" />Orders ({stats.totalOrders})</>}>
            <Card className="border-0 shadow-sm mt-2" style={{ borderRadius: "16px" }}>
              <Card.Body className="p-4">
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Est. Delivery</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td className="fw-bold">#{order.id}</td>
                          <td>{order.product_name || order.product}</td>
                          <td>{formatCurrency(order.total_amount || order.price || 0)}</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td><FaCalendarAlt className="me-1" />{new Date(order.created_at).toLocaleDateString()}</td>
                          <td><FaTruck className="me-1" />{getEstimatedDelivery(order.created_at)}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>
                              <FaEye /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {recentOrders.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">No orders yet</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Reviews Tab */}
          <Tab eventKey="reviews" title={<><FaStar className="me-2" />Reviews ({reviews.length})</>}>
            <Card className="border-0 shadow-sm mt-2" style={{ borderRadius: "16px" }}>
              <Card.Body className="p-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-4">
                    <FaStar size={40} className="text-muted mb-3" />
                    <p className="text-muted">No reviews yet. Start selling to get customer feedback!</p>
                  </div>
                ) : (
                  <>
                    <Row className="mb-4">
                      <Col md={4} className="text-center">
                        <h1 className="fw-bold" style={{ fontSize: "2.5rem" }}>{stats.averageRating || 0}</h1>
                        <div className="d-flex justify-content-center gap-1 mb-2">{renderStars(Math.round(stats.averageRating || 0))}</div>
                        <p className="text-muted">Based on {reviews.length} reviews</p>
                      </Col>
                      <Col md={8}>
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = reviews.filter(r => Math.floor(r.rating) === star).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="d-flex align-items-center gap-2 mb-2">
                              <span style={{ width: "45px" }}>{star} ★</span>
                              <ProgressBar now={percentage} variant="warning" style={{ flex: 1, height: "8px" }} />
                              <span style={{ width: "45px" }}>{percentage.toFixed(0)}%</span>
                            </div>
                          );
                        })}
                      </Col>
                    </Row>
                    {reviews.slice(0, 5).map(review => (
                      <Card key={review.id} className="mb-3 border-0 bg-light">
                        <Card.Body>
                          <div className="d-flex gap-1 mb-2">{renderStars(review.rating)}</div>
                          <p className="mb-2">{review.comment || "Great product! Highly recommended."}</p>
                          <small className="text-muted">- {review.user_name || "Anonymous"} • {new Date(review.created_at).toLocaleDateString()}</small>
                          <Button variant="link" size="sm" className="p-0 mt-2" onClick={() => { setSelectedReview(review); setShowReviewModal(true); }}><FaRegComment className="me-1" /> Reply</Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* Analytics Tab */}
          <Tab eventKey="analytics" title={<><FaChartLine className="me-2" />Analytics</>}>
            <Row className="g-4 mt-2">
              <Col md={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Traffic Sources</h5>
                    {analyticsData.topReferrers.map((ref, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="d-flex justify-content-between mb-1"><span>{ref.source}</span><span className="fw-bold">{ref.visits.toLocaleString()} visits ({ref.percentage}%)</span></div>
                        <ProgressBar now={ref.percentage} variant="primary" style={{ height: "8px" }} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Top Countries</h5>
                    {analyticsData.topCountries.map((country, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="d-flex justify-content-between mb-1"><span>{country.country}</span><span className="fw-bold">{country.visits.toLocaleString()} visits ({country.percentage}%)</span></div>
                        <ProgressBar now={country.percentage} variant="success" style={{ height: "8px" }} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="g-4 mt-2">
              <Col md={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Device Breakdown</h5>
                    <div style={{ height: "200px" }}><Doughnut data={deviceChartData} options={{ responsive: true, maintainAspectRatio: true }} /></div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Browser Breakdown</h5>
                    {Object.entries(analyticsData.browserBreakdown).map(([browser, percentage]) => (
                      <div key={browser} className="mb-3">
                        <div className="d-flex justify-content-between mb-1"><span className="text-capitalize">{browser}</span><span className="fw-bold">{percentage}%</span></div>
                        <ProgressBar now={percentage} variant="info" style={{ height: "8px" }} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={12}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Hourly Traffic</h5>
                    <Bar data={hourlyChartData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} height={300} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>

      {/* Modals */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>{formData.id ? "Edit Product" : "Add New Product"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Product Name *</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} required /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Price (₦) *</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Form.Group></Col></Row>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Stock Quantity</Form.Label><Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Select name="category" value={formData.category} onChange={handleChange}><option value="">Select category</option><option value="Electronics">Electronics</option><option value="Fashion">Fashion</option><option value="Home & Living">Home & Living</option><option value="Books">Books</option></Form.Select></Form.Group></Col></Row>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Product Image</Form.Label><Form.Control type="file" name="image" onChange={handleChange} accept="image/*" />{previewImage && <img src={previewImage} alt="Preview" style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }} />}</Form.Group>
            <Button type="submit" className="w-100" disabled={adding}>{adding ? <><Spinner size="sm" className="me-2" /> Saving...</> : (formData.id ? "Update Product" : "Add Product")}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Order #{selectedOrder?.id}</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedOrder && (<>
            <p><strong>Product:</strong> {selectedOrder.product_name}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity || 1}</p>
            <p><strong>Total:</strong> {formatCurrency(selectedOrder.total_amount || selectedOrder.price || 0)}</p>
            <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
            <p><strong>Estimated Delivery:</strong> <FaTruck className="me-1" />{getEstimatedDelivery(selectedOrder.created_at)}</p>
            <Form.Group className="mt-3">
              <Form.Label>Update Status</Form.Label>
              <Form.Select onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)} value={selectedOrder.status}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </>)}
        </Modal.Body>
      </Modal>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Reply to Review</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedReview && (<><div className="mb-3"><div className="d-flex gap-1 mb-2">{renderStars(selectedReview.rating)}</div><p>{selectedReview.comment || "Great product!"}</p><small className="text-muted">- {selectedReview.user_name || "Anonymous"}</small></div>
          <Form.Group><Form.Label>Your Reply</Form.Label><Form.Control as="textarea" rows={3} placeholder="Write your reply..." /></Form.Group></>)}
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowReviewModal(false)}>Cancel</Button><Button variant="primary">Send Reply</Button></Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body><FaExclamationTriangle className="text-warning me-2" size={24} /> Are you sure you want to delete this product? This action cannot be undone.</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></Modal.Footer>
      </Modal>

      {/* WhatsApp Button */}
      <a href="https://wa.me/2349098746971" target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: "25px", right: "25px", background: "#25D366", color: "white", width: "55px", height: "55px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(37,211,102,0.3)", zIndex: 1000 }}><FaWhatsapp size={28} /></a>
    </div>
  );
};

export default Dashboard;