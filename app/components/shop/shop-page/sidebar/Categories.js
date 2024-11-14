/* eslint-disable react/prop-types */
'use client'

import Image from "next/image"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import db from "@/utils/appwrite/Services/dbServices"
import storageServices from "@/utils/appwrite/Services/storageServices"
import React from "react"

export default function Categories({ onCategorySelect }) {
  const [categories, setCategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(new Map())
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await db.Categories.list()
        const docs = response.documents

        const categoriesWithImages = await Promise.all(
          docs.map(async (doc) => {
            const imageUrl = doc.image ? await storageServices.images.getFileDownload(doc.image) : null
            return { ...doc, imageUrl }
          })
        )

        setCategories(categoriesWithImages)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newExpandedCategories = new Map(prev)
      newExpandedCategories.set(categoryId, !newExpandedCategories.get(categoryId))
      return newExpandedCategories
    })
  }

  const selectCategory = (categoryId) => {
    const categoryIds = getAllCategoryIds(categoryId)
    setSelectedCategory(categoryId)
    if (onCategorySelect) onCategorySelect(categoryIds)
  }

  const getAllCategoryIds = (categoryId) => {
    const collectCategoryIds = (id, ids) => {
      ids.push(id)
      getSubcategories(id).forEach(sub => collectCategoryIds(sub.$id, ids))
    }
    const categoryIds = []
    collectCategoryIds(categoryId, categoryIds)
    return categoryIds
  }

  const getSubcategories = (parentId) => {
    return categories.filter((category) => category.parentCategoryId === parentId)
  }

  const getRootCategories = () => {
    return categories.filter((category) => !category.parentCategoryId)
  }

  const renderCategory = (category, level = 0) => {
    const subcategories = getSubcategories(category.$id)
    const hasSubcategories = subcategories.length > 0
    const isExpanded = expandedCategories.get(category.$id) || false
    const isSelected = selectedCategory === category.$id

    const categoryClasses = `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer group ${isSelected ? 'bg-gray-200' : ''}`
    const iconClasses = "text-gray-400 cursor-pointer"

    return (
      <div key={category.$id} style={{ marginLeft: `${level * 1}rem` }}>
        <div onClick={() => selectCategory(category.$id)} className={categoryClasses}>
          <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          <div className="flex items-center justify-between flex-1">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
              {category.description && (
                <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
              )}
            </div>
            {hasSubcategories && (
              <div className={iconClasses} onClick={(e) => {
                e.stopPropagation() 
                toggleCategory(category.$id)
              }}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            )}
          </div>
        </div>

        {isExpanded && hasSubcategories && (
          <div className="ml-2 border-l border-gray-200 pl-2 mt-1">
            {subcategories.map((subcategory) => renderCategory(subcategory, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return Array.from({ length: 3 }, (_, idx) => (
      <div key={idx} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
    ))
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {getRootCategories().map((category) => renderCategory(category))}
    </div>
  )
}
