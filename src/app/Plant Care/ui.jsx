import React, { useState } from 'react'
import { 
  FaSun, 
  FaTint, 
  FaLeaf, 
  FaBug, 
  FaSeedling, 
  FaTemperatureHigh,
  FaArrowRight,
  FaCheckCircle,
  FaBook,
  FaUsers,
  FaClipboardList,
  FaLightbulb
} from 'react-icons/fa'
import { Spin } from 'antd'
import plantImage from '../../assets/image 1.png'
import { Link } from 'react-router'

const Plant = () => {
  const [activeCategory, setActiveCategory] = useState('watering')

  const careCategories = [
    {
      id: 'watering',
      title: 'Watering',
      icon: <FaTint className="text-4xl" />,
      color: 'bg-blue-100 text-blue-600',
      tips: [
        'Water plants when the top inch of soil feels dry',
        'Use room temperature water to avoid shocking roots',
        'Water thoroughly until water drains from the bottom',
        'Avoid overwatering - it can lead to root rot',
        'Different plants have different water needs'
      ]
    },
    {
      id: 'lighting',
      title: 'Lighting',
      icon: <FaSun className="text-4xl" />,
      color: 'bg-yellow-100 text-yellow-600',
      tips: [
        'Most houseplants prefer bright, indirect light',
        'Place plants near east or west-facing windows',
        'Rotate plants regularly for even growth',
        'Watch for signs of too much or too little light',
        'Some plants thrive in low light conditions'
      ]
    },
    {
      id: 'fertilizing',
      title: 'Fertilizing',
      icon: <FaLeaf className="text-4xl" />,
      color: 'bg-green-100 text-green-600',
      tips: [
        'Fertilize during growing season (spring and summer)',
        'Use balanced fertilizer (10-10-10) for most plants',
        'Dilute fertilizer to half strength for houseplants',
        'Fertilize every 2-4 weeks during active growth',
        'Stop fertilizing in fall and winter'
      ]
    },
    {
      id: 'pest',
      title: 'Pest Control',
      icon: <FaBug className="text-4xl" />,
      color: 'bg-red-100 text-red-600',
      tips: [
        'Inspect plants regularly for pests',
        'Isolate infected plants immediately',
        'Use neem oil or insecticidal soap for treatment',
        'Wipe leaves with damp cloth to remove pests',
        'Maintain good air circulation to prevent infestations'
      ]
    },
    {
      id: 'repotting',
      title: 'Repotting',
      icon: <FaSeedling className="text-4xl" />,
      color: 'bg-purple-100 text-purple-600',
      tips: [
        'Repot when roots fill the container',
        'Choose a pot only 1-2 inches larger',
        'Use well-draining potting mix',
        'Best time to repot is in spring',
        'Water thoroughly after repotting'
      ]
    },
    {
      id: 'temperature',
      title: 'Temperature',
      icon: <FaTemperatureHigh className="text-4xl" />,
      color: 'bg-orange-100 text-orange-600',
      tips: [
        'Most houseplants prefer 65-75°F (18-24°C)',
        'Avoid placing plants near heating or AC vents',
        'Protect from cold drafts in winter',
        'Some plants need cooler temperatures at night',
        'Monitor temperature fluctuations'
      ]
    }
  ]

  const quickTips = [
    {
      title: 'Check Soil Moisture',
      description: 'Use your finger to test soil moisture before watering',
      icon: '💧'
    },
    {
      title: 'Dust Leaves',
      description: 'Wipe leaves monthly to help plants photosynthesize better',
      icon: '🍃'
    },
    {
      title: 'Prune Regularly',
      description: 'Remove dead or yellowing leaves to encourage new growth',
      icon: '✂️'
    },
    {
      title: 'Monitor Humidity',
      description: 'Group plants together to increase humidity levels',
      icon: '🌫️'
    }
  ]

  const activeCategoryData = careCategories.find(cat => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900  to-black rounded-2xl py-20 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
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
                Plant Care Guide
              </h1>
              <p className="text-xl md:text-2xl text-green-50 max-w-3xl mb-6 drop-shadow-md">
                Learn how to keep your plants healthy and thriving with our comprehensive care guides
              </p>
              
              {/* Additional Information */}
              <div className="space-y-4 mb-6">
                <p className="text-lg text-green-100 max-w-2xl">
                  Master the art of plant care with expert tips, step-by-step guides, and proven techniques. 
                  Whether you're a beginner or experienced gardener, find everything you need to nurture your green companions.
                </p>
                
                {/* Key Features */}
                <div className="hidden md:flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Step-by-Step Guides</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Expert Tips</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Problem Solutions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <FaCheckCircle className="text-green-200" />
                    <span className="text-white text-sm font-medium">Seasonal Care</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl transform rotate-6"></div>
                <img 
                  src={plantImage} 
                  alt="Beautiful plant" 
                  className="relative w-full max-w-md md:max-w-lg h-auto object-contain rounded-2xl drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaClipboardList className="text-2xl text-white" />
                </div>
                <div className='md:block flex gap-2 mt-2'>
                  <div className="text-3xl font-bold text-white">{careCategories.length}</div>
                  <div className="text-green-100 text-sm font-medium">Care Categories</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaLightbulb className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-green-100 text-sm font-medium">Expert Tips</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaBook className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">100+</div>
                  <div className="text-green-100 text-sm font-medium">Care Guides</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="md:flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">25K+</div>
                  <div className="text-green-100 text-sm font-medium">Happy Gardeners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Care Categories
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {careCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? `${category.color} shadow-lg ring-2 ring-[#46A358]`
                    : 'bg-white hover:bg-gray-50 shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={activeCategory === category.id ? '' : 'text-gray-600'}>
                    {category.icon}
                  </div>
                  <p className={`font-semibold text-sm md:text-base ${
                    activeCategory === category.id ? '' : 'text-gray-700'
                  }`}>
                    {category.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Category Details */}
        {activeCategoryData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className={`${activeCategoryData.color} p-4 rounded-xl`}>
                {activeCategoryData.icon}
              </div>
              <h3 className="md:text-3xl text-2xl font-bold text-gray-800">
                {activeCategoryData.title} Tips
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {activeCategoryData.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaCheckCircle className="text-[#46A358] text-xl mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Quick Care Tips
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {tip.title}
                </h4>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Care Guide */}
        <div className="bg-gradient-to-br from-[#46A358] to-[#3a8a47] rounded-2xl shadow-xl p-8 md:p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Essential Plant Care Checklist
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <FaCheckCircle className="text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2">Weekly Tasks</h4>
                <ul className="space-y-2 text-green-100">
                  <li>• Check soil moisture levels</li>
                  <li>• Inspect for pests and diseases</li>
                  <li>• Remove dead or yellowing leaves</li>
                  <li>• Rotate plants for even growth</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <FaCheckCircle className="text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2">Monthly Tasks</h4>
                <ul className="space-y-2 text-green-100">
                  <li>• Clean leaves with damp cloth</li>
                  <li>• Fertilize during growing season</li>
                  <li>• Check for root-bound plants</li>
                  <li>• Prune to maintain shape</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Need More Help?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our shop to find the perfect plants for your home, or check out our blogs for more detailed care guides and plant inspiration.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/Shop"
              className="bg-[#46A358] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3a8a47] transition-colors flex items-center gap-2"
            >
              Shop Plants
              <FaArrowRight />
            </Link>
            <Link
              to="/Blogs"
              className="border-2 border-[#46A358] text-[#46A358] px-8 py-3 rounded-lg font-semibold hover:bg-[#46A358] hover:text-white transition-colors flex items-center gap-2"
            >
              Read Blogs
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Plant