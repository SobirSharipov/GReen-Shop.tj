import React, { useState, useMemo } from 'react'
import { useGetUsersQuery } from '../../services/UserApi'
import { Link } from 'react-router'
import { Pagination, Spin } from 'antd'
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTag,
  FaArrowRight,
  FaSearch,
  FaBook,
  FaUsers,
  FaLeaf,
  FaCheckCircle
} from 'react-icons/fa'
import blogImage from '../../assets/img1.svg'

const Blogs = () => {
  const { data: allData, isLoading, error } = useGetUsersQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 9

  // Assign categories to blogs based on their index
  const getBlogCategory = (index, total) => {
    // Distribute blogs across categories
    const categoryIndex = index % 4
    switch (categoryIndex) {
      case 0: return 'care'
      case 1: return 'tips'
      case 2: return 'guides'
      case 3: return 'news'
      default: return 'care'
    }
  }

  // Calculate category counts dynamically
  const blogCategories = useMemo(() => {
    if (!allData) return []
    
    const counts = {
      all: allData.length,
      care: 0,
      tips: 0,
      guides: 0,
      news: 0
    }
    
    allData.forEach((_, index) => {
      const category = getBlogCategory(index, allData.length)
      counts[category]++
    })
    
    return [
      { id: 'all', name: 'All Posts', count: counts.all },
      { id: 'care', name: 'Plant Care', count: counts.care },
      { id: 'tips', name: 'Tips & Tricks', count: counts.tips },
      { id: 'guides', name: 'Guides', count: counts.guides },
      { id: 'news', name: 'News', count: counts.news }
    ]
  }, [allData])

  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Filter and search blogs
  const filteredBlogs = useMemo(() => {
    if (!allData) return []
    
    let filtered = [...allData]
    
    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(blog => 
        blog.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.lorem?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Category filter - real filtering based on assigned categories
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((blog, index) => {
        const blogCategory = getBlogCategory(index, allData.length)
        return blogCategory === selectedCategory
      })
    }
    
    return filtered
  }, [allData, selectedCategory, searchQuery])

  // Pagination
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredBlogs.slice(startIndex, endIndex)
  }, [filteredBlogs, currentPage, pageSize])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Format date (using data field if available, otherwise generate)
  const formatDate = (blog) => {
    if (blog.data) return blog.data
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        Error loading blogs. Please try again later.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#46A358] via-[#3a8a47] to-[#2d6e3a] rounded-2xl py-20 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#66BB6A] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#81C784] rounded-full blur-3xl"></div>
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                Our Blog
              </h1>
              <p className="text-xl md:text-2xl text-green-50 max-w-3xl mb-6 drop-shadow-md">
                Discover expert tips, plant care guides, and inspiring stories to help your plants thrive
              </p>
              
              {/* Additional Information */}
              <div className="space-y-4 mb-6">
                <p className="text-lg text-green-100 max-w-2xl">
                  Join our community of plant enthusiasts and learn from experienced gardeners. 
                  Get access to exclusive content, seasonal guides, and personalized care recommendations.
                </p>
                
                {/* Key Features */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Expert Guides</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Seasonal Tips</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Community Support</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl transform rotate-6"></div>
                <img 
                  src={blogImage} 
                  alt="Blog illustration" 
                  className="relative w-full max-w-md md:max-w-lg h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaBook className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{allData?.length || 0}+</div>
                  <div className="text-green-100 text-sm">Blog Posts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-green-100 text-sm">Expert Authors</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaTag className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">5+</div>
                  <div className="text-green-100 text-sm">Categories</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaLeaf className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-green-100  text-sm">Monthly Readers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#46A358] focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#46A358] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-sm opacity-75">
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {paginatedBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Blog Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={blog.avatar}
                      alt={blog.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#46A358] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <FaTag className="inline mr-1" />
                        Plant Care
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Date and Author */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {formatDate(blog)}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaUser />
                        Admin
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#46A358] transition-colors">
                      {blog.name || 'Blog Post Title'}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateText(blog.lorem || 'Discover the secrets to keeping your plants healthy and thriving with our comprehensive guide...', 120)}
                    </p>

                    {/* Read More Button */}
                    <Link to={`/info/${blog.id}`}>
                      <button className="flex items-center gap-2 text-[#46A358] font-semibold hover:gap-3 transition-all duration-300 group/btn">
                        Read More
                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredBlogs.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                className="custom-pagination"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No blogs match your search "${searchQuery}"`
                : 'No blogs available at the moment'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[#46A358] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-[#46A358] to-[#3a8a47] rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h3>
          <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest plant care tips, guides, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-[#46A358] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogs
