/**  ProductEditor.jsx  (plain JS – FULLY UPDATED)  **/
import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Upload,
  AlertCircle,
  Eye,
  EyeOff,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setFormData,
  resetForm,
  selectProducts,
  selectProductForm,
  selectProductLoading,
  selectProductError,
} from "@/store/slices/productSlice";

import {
  fetchCategories,
  selectCategories,
} from "@/store/slices/categorySlice";

import {
  openForm,
  closeForm,
  setSearchTerm,
  setSubmitting,
  incrementRetry,
  resetRetry,
  selectShowForm,
  selectIsEditing,
  selectEditId,
  selectSearchTerm,
  selectIsSubmitting,
  selectRetryCount,
} from "@/store/slices/uiSlice";

import { selectTenantId } from "@/store/slices/authSlice";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MAX_PDF_SIZE = 4 * 1024 * 1024;
const MAX_RETRIES = 3;
const PLACEHOLDER_IMAGE =
  "https://placehold.co/50x50?text=No+Image&font=roboto";

const ProductEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const form = useSelector(selectProductForm);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const categories = useSelector(selectCategories);
  const showForm = useSelector(selectShowForm);
  const isEditing = useSelector(selectIsEditing);
  const editId = useSelector(selectEditId);
  const searchTerm = useSelector(selectSearchTerm);
  const isSubmitting = useSelector(selectIsSubmitting);
  const retryCount = useSelector(selectRetryCount);
  const tenantId = useSelector(selectTenantId);

  const editingProduct = products.find((p) => p.id === editId);

  /* ------------------------------------------------------------------ */
  /*  FETCH DATA                                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!tenantId) {
      const stored = localStorage.getItem("tenant_id");
      if (!stored) {
        toast.error("Please log in to continue.");
        navigate("/backoffice-login");
      }
      return;
    }

    const load = async () => {
      try {
        await dispatch(fetchProducts(tenantId)).unwrap();
        toast.success("Products loaded!");
        dispatch(resetRetry());
      } catch (e) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => dispatch(incrementRetry()), 2000);
        } else {
          toast.error("Unable to load products.");
        }
      }
      await dispatch(fetchCategories(tenantId));
    };
    load();
  }, [tenantId, retryCount, dispatch, navigate]);

  /* ------------------------------------------------------------------ */
  /*  SEARCH DEBOUNCE                                                   */
  /* ------------------------------------------------------------------ */
  const debounce = (fn, delay) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };
  const handleSearchChange = useCallback(
    debounce((v) => dispatch(setSearchTerm(v)), 300),
    [dispatch]
  );

  /* ------------------------------------------------------------------ */
  /*  FORM ACTIONS                                                      */
  /* ------------------------------------------------------------------ */
  const handleAddNew = () => {
    dispatch(openForm({ isEditing: false }));
    dispatch(resetForm());
  };

  const handleEdit = (product) => {
    dispatch(openForm({ isEditing: true, editId: product.id }));
    dispatch(
      setFormData({
        category_id: product.category_id || "",
        name: product.name || "",
        title: product.title || "",
        your_price: product.your_price || "",
        base_price: product.base_price || "",
        preferred_customer_price: product.preferred_customer_price || "",
        availability: product.availability || "in_stock",
        status: product.status || "active",
        image_url: null,
        banner_image_url: null,
        guide_pdf_url: null,
        productBanners: null,
        video_url: product.video_url || "",
        instructions: product.instructions || "",
        description: product.description || "",
        buy_link: product.buy_link || "",
        is_visible: product.is_visible ? "1" : "0",
        country: product.country || "",
        currency: product.currency || "",
        currency_symbol: product.currency_symbol || "",
        // list fields
        keyIngredients: arrayToLines(product.keyIngredients),
        keyBenefits: arrayToLines(product.keyBenefits),
        cautionsAndDisclaimers: arrayToLines(product.cautionsAndDisclaimers),
        cautionsfdaDisclaimer: arrayToLines(product.cautionsfdaDisclaimer),
        patentsAndCertifications: arrayToLines(product.patentsAndCertifications),
        allergyInfo: arrayToLines(product.allergyInfo),
        freeOf: arrayToLines(product.freeOf),
        directionsForUse: product.directionsForUse || "",
      })
    );
  };

  const arrayToLines = (arr) =>
    Array.isArray(arr) ? arr.join("\n") : arr || "";

  const handleCancel = () => {
    dispatch(closeForm());
    dispatch(resetForm());
  };

  /* ------------------------------------------------------------------ */
  /*  FILE VALIDATION                                                   */
  /* ------------------------------------------------------------------ */
  const validateFile = (file, type, max) => {
    if (!file) return true;
    if (file.size > max) {
      toast.error(`${type} exceeds ${(max / 1024 / 1024).toFixed(0)} MB limit.`);
      return false;
    }
    const mimeMap = {
      image: ["image/jpeg", "image/jpg", "image/png"],
      pdf: ["application/pdf"],
    };
    if (!mimeMap[type].includes(file.type)) {
      toast.error(
        `Invalid ${type} type. Allowed: ${mimeMap[type]
          .join(", ")
          .replace(/image\//g, "")
          .replace(/application\//g, "")}`
      );
      return false;
    }
    return true;
  };

  const handleFileChange = (field, file) => {
    const type = field.includes("image")
      ? "image"
      : field.includes("pdf")
      ? "pdf"
      : "video";
    const max = field.includes("image")
      ? MAX_IMAGE_SIZE
      : field.includes("pdf")
      ? MAX_PDF_SIZE
      : 0;

    if (file && validateFile(file, type, max)) {
      dispatch(setFormData({ [field]: file }));
      toast.success(`${field.replace(/_/g, " ")} selected`);
    } else if (!file) {
      dispatch(setFormData({ [field]: null }));
    }
  };

  const handleRemoveFile = (field) => {
    dispatch(setFormData({ [field]: null }));
    toast.success(`${field.replace(/_/g, " ")} removed`);
  };

  /* ------------------------------------------------------------------ */
  /*  YOUTUBE VALIDATION                                                */
  /* ------------------------------------------------------------------ */
  const validateYouTube = (url) => {
    if (!url) return true;
    const re =
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[A-Za-z0-9_-]+(\?.*)?$/;
    if (!re.test(url)) {
      toast.error(
        "Invalid YouTube embed URL. Use: https://www.youtube.com/embed/VIDEO_ID"
      );
      return false;
    }
    return true;
  };

  /* ------------------------------------------------------------------ */
  /*  SAVE PRODUCT                                                      */
  /* ------------------------------------------------------------------ */
  const handleSave = async () => {
    if (!tenantId) return toast.error("Session lost. Please login again.");

    // required fields
    if (!form.category_id) return toast.error("Select a category.");
    if (!form.name?.trim()) return toast.error("Product name required.");
    if (!form.title?.trim()) return toast.error("Product title required.");
    if (!form.your_price || isNaN(+form.your_price) || +form.your_price < 0)
      return toast.error("Your price must be a positive number.");
    if (!form.base_price || isNaN(+form.base_price) || +form.base_price < 0)
      return toast.error("Base price must be a positive number.");
    if (
      !form.preferred_customer_price ||
      isNaN(+form.preferred_customer_price) ||
      +form.preferred_customer_price < 0
    )
      return toast.error("Preferred customer price must be a positive number.");

    if (!validateYouTube(form.video_url)) return;

    // file validation
    if (
      !validateFile(form.image_url, "image", MAX_IMAGE_SIZE) ||
      !validateFile(form.banner_image_url, "image", MAX_IMAGE_SIZE) ||
      !validateFile(form.guide_pdf_url, "pdf", MAX_PDF_SIZE) ||
      !validateFile(form.productBanners, "image", MAX_IMAGE_SIZE)
    )
      return;

    const fd = new FormData();
    fd.append("category_id", form.category_id);
    fd.append("name", form.name);
    fd.append("title", form.title);
    fd.append("your_price", form.your_price);
    fd.append("base_price", form.base_price);
    fd.append("preferred_customer_price", form.preferred_customer_price);
    fd.append("availability", form.availability);
    fd.append("status", form.status);
    fd.append("buy_link", form.buy_link || "");
    fd.append("video_url", form.video_url || "");
    fd.append("instructions", form.instructions || "");
    fd.append("description", form.description || "");
    fd.append("fullDescription", form.description || "");
    fd.append("is_visible", form.is_visible || "1");
    fd.append("country", form.country || "");
    fd.append("currency", form.currency || "");
    fd.append("currency_symbol", form.currency_symbol || "");

    // JSON list fields
    const toJson = (val) =>
      JSON.stringify(
        (val || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    fd.append("keyIngredients", toJson(form.keyIngredients));
    fd.append("keyBenefits", toJson(form.keyBenefits));
    fd.append("cautionsAndDisclaimers", toJson(form.cautionsAndDisclaimers));
    fd.append("cautionsfdaDisclaimer", toJson(form.cautionsfdaDisclaimer));
    fd.append("patentsAndCertifications", toJson(form.patentsAndCertifications));
    fd.append("allergyInfo", toJson(form.allergyInfo));
    fd.append("freeOf", toJson(form.freeOf));
    fd.append("directionsForUse", form.directionsForUse || "");

    // files
    if (form.image_url) fd.append("image_url", form.image_url);
    if (form.banner_image_url) fd.append("banner_image_url", form.banner_image_url);
    if (form.guide_pdf_url) fd.append("guide_pdf_url", form.guide_pdf_url);
    if (form.productBanners) fd.append("productBanners", form.productBanners);

    dispatch(setSubmitting(true));

    try {
      if (isEditing) {
        await toast.promise(
          dispatch(
            updateProduct({ tenantId, productId: editId, formData: fd })
          ).unwrap(),
          {
            loading: "Updating…",
            success: "Product updated!",
            error: (e) => e?.message || "Update failed",
          }
        );
      } else {
        await toast.promise(
          dispatch(createProduct({ tenantId, formData: fd })).unwrap(),
          {
            loading: "Creating…",
            success: "Product created!",
            error: (e) => e?.message || "Create failed",
          }
        );
      }

      await dispatch(fetchProducts(tenantId));
      handleCancel();
    } catch (e) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  /* ------------------------------------------------------------------ */
  /*  DELETE PRODUCT                                                    */
  /* ------------------------------------------------------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    dispatch(setSubmitting(true));
    try {
      await toast.promise(
        dispatch(deleteProduct({ tenantId, productId: id })).unwrap(),
        {
          loading: "Deleting…",
          success: "Deleted!",
          error: (e) => e?.message || "Delete failed",
        }
      );
      await dispatch(fetchProducts(tenantId));
    } catch (e) {
      toast.error(e?.message || "Delete error");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  /* ------------------------------------------------------------------ */
  /*  FILTERED LIST                                                     */
  /* ------------------------------------------------------------------ */
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.category_name?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  /* ------------------------------------------------------------------ */
  /*  TAG INPUT COMPONENT                                               */
  /* ------------------------------------------------------------------ */
  const TagInput = ({ label, value, field, placeholder }) => {
    const [input, setInput] = useState("");
    const lines = (value || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const addTag = (txt) => {
      const trimmed = txt.trim();
      if (!trimmed) return;
      const newVal = value ? `${value}\n${trimmed}` : trimmed;
      dispatch(setFormData({ [field]: newVal }));
      setInput("");
    };

    const removeTag = (idx) => {
      const arr = lines.filter((_, i) => i !== idx);
      dispatch(setFormData({ [field]: arr.join("\n") }));
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(input);
      } else if (e.key === "Backspace" && !input && lines.length) {
        removeTag(lines.length - 1);
      }
    };

    const handlePaste = (e) => {
      const pasted = e.clipboardData.getData("text");
      try {
        const parsed = JSON.parse(pasted);
        if (Array.isArray(parsed)) {
          e.preventDefault();
          const newVal = parsed
            .map((s) => String(s).trim())
            .filter(Boolean)
            .join("\n");
          dispatch(setFormData({ [field]: newVal }));
          setInput("");
        }
      } catch {
        // ignore
      }
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-gray-50 min-h-[48px]">
          {lines.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="ml-1 text-blue-600 hover:text-blue-800"
                disabled={isSubmitting}
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={lines.length ? "" : placeholder}
            disabled={isSubmitting}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          />
        </div>
        <p className="text-xs text-gray-500">
          Press <kbd className="px-1 bg-gray-200 rounded">Enter</kbd> to add •
          Paste JSON array to import many.
        </p>
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /*  IMAGE WITH FALLBACK                                               */
  /* ------------------------------------------------------------------ */
  const ImageWithFallback = ({ src, alt, className }) => {
    const [img, setImg] = useState(src || PLACEHOLDER_IMAGE);
    const [err, setErr] = useState(false);

    if (!src) {
      return (
        <div
          className={`flex items-center justify-center bg-gray-100 rounded-md text-xs text-gray-500 ${className}`}
        >
          No Image
        </div>
      );
    }

    return (
      <img
        src={img}
        alt={alt}
        className={className}
        onError={() => {
          if (!err) {
            setErr(true);
            setImg(PLACEHOLDER_IMAGE);
          }
        }}
        loading="lazy"
      />
    );
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Toaster position="top-right" />

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {!showForm && (
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        )}
        {!showForm && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search…"
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              onClick={handleAddNew}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        )}
      </div>

      {/* ---------- LOADING / ERRORS ---------- */}
      {loading && (
        <div className="flex flex-col items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
          <p className="mt-3 text-gray-600">Loading products…</p>
        </div>
      )}

      {error && retryCount >= MAX_RETRIES && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Failed to load</h3>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => {
              dispatch(resetRetry());
              dispatch(fetchProducts(tenantId));
            }}
            className="px-5 py-2 bg-black text-white rounded-full"
          >
            Retry
          </button>
        </div>
      )}

      {/* ---------- PRODUCT LIST ---------- */}
      {!showForm && !loading && tenantId && !error && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Visible</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No products found.{" "}
                      <button
                        onClick={handleAddNew}
                        className="text-blue-600 underline"
                      >
                        Add one
                      </button>
                      .
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{i + 1}</td>
                      <td className="px-4 py-3 text-sm">{p.category_name || "—"}</td>
                      <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                      <td className="px-4 py-3">
                        <ImageWithFallback
                          src={p.image_url}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {p.is_visible ? (
                          <Eye className="text-green-600" size={18} />
                        ) : (
                          <EyeOff className="text-gray-400" size={18} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            p.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-3">
                        <button
                          onClick={() => handleEdit(p)}
                          disabled={isSubmitting}
                          className="text-gray-600 hover:text-black"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={isSubmitting}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------- PRODUCT FORM ---------- */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>
          </div>

          {/* ---- BASIC INFO ---- */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  dispatch(setFormData({ category_id: e.target.value }))
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              >
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  dispatch(setFormData({ name: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="Enter name"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  dispatch(setFormData({ title: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="Enter title"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Show on Storefront
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_visible === "1"}
                  onChange={(e) =>
                    dispatch(
                      setFormData({
                        is_visible: e.target.checked ? "1" : "0",
                      })
                    )
                  }
                  disabled={isSubmitting}
                  className="w-5 h-5 text-black rounded focus:ring-black"
                />
                <span className="text-sm">
                  {form.is_visible === "1" ? "Visible" : "Hidden"}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={form.availability}
                onChange={(e) =>
                  dispatch(setFormData({ availability: e.target.value }))
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="pre_order">Pre-Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  dispatch(setFormData({ status: e.target.value }))
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* ---- PRICES ---- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.your_price}
                onChange={(e) =>
                  dispatch(setFormData({ your_price: e.target.value }))
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.base_price}
                onChange={(e) =>
                  dispatch(setFormData({ base_price: e.target.value }))
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Customer Price{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.preferred_customer_price}
                onChange={(e) =>
                  dispatch(
                    setFormData({
                      preferred_customer_price: e.target.value,
                    })
                  )
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Link
              </label>
              <input
                type="url"
                value={form.buy_link}
                onChange={(e) =>
                  dispatch(setFormData({ buy_link: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="https://…"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={form.country}
                onChange={(e) =>
                  dispatch(setFormData({ country: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="e.g. USA"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) =>
                  dispatch(setFormData({ currency: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="e.g. USD"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={form.currency_symbol}
                onChange={(e) =>
                  dispatch(setFormData({ currency_symbol: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="e.g. $"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          {/* ---- YOUTUBE ---- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Embed URL (optional)
            </label>
            <input
              type="text"
              value={form.video_url}
              onChange={(e) =>
                dispatch(setFormData({ video_url: e.target.value }))
              }
              disabled={isSubmitting}
              placeholder="https://www.youtube.com/embed/…"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300"
            />
            {form.video_url && (
              <div className="mt-2">
                <iframe
                  src={form.video_url}
                  title="preview"
                  className="w-full h-48 rounded-md"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* ---- FILE UPLOADS ---- */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image (≤4 MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) =>
                  handleFileChange("image_url", e.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {(form.image_url ||
                (isEditing && editingProduct?.image_url)) && (
                <div className="mt-2 flex items-center gap-2">
                  <ImageWithFallback
                    src={
                      form.image_url
                        ? URL.createObjectURL(form.image_url)
                        : editingProduct?.image_url
                    }
                    alt="img"
                    className="h-20 w-20 object-cover rounded"
                  />
                  {form.image_url && (
                    <button
                      onClick={() => handleRemoveFile("image_url")}
                      className="text-red-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image (≤4 MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) =>
                  handleFileChange(
                    "banner_image_url",
                    e.target.files?.[0] ?? null
                  )
                }
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {(form.banner_image_url ||
                (isEditing && editingProduct?.banner_image_url)) && (
                <div className="mt-2 flex items-center gap-2">
                  <ImageWithFallback
                    src={
                      form.banner_image_url
                        ? URL.createObjectURL(form.banner_image_url)
                        : editingProduct?.banner_image_url
                    }
                    alt="banner"
                    className="h-20 w-20 object-cover rounded"
                  />
                  {form.banner_image_url && (
                    <button
                      onClick={() => handleRemoveFile("banner_image_url")}
                      className="text-red-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Guide PDF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guide PDF (≤4 MB)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  handleFileChange(
                    "guide_pdf_url",
                    e.target.files?.[0] ?? null
                  )
                }
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {form.guide_pdf_url && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {form.guide_pdf_url.name}
                  </span>
                  <button
                    onClick={() => handleRemoveFile("guide_pdf_url")}
                    className="text-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Product Banners */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Banner (≤4 MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) =>
                  handleFileChange(
                    "productBanners",
                    e.target.files?.[0] ?? null
                  )
                }
                disabled={isSubmitting}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {(form.productBanners ||
                (isEditing && editingProduct?.productBanners)) && (
                <div className="mt-2 flex items-center gap-2">
                  <ImageWithFallback
                    src={
                      form.productBanners
                        ? URL.createObjectURL(form.productBanners)
                        : editingProduct?.productBanners
                    }
                    alt="extra"
                    className="h-20 w-20 object-cover rounded"
                  />
                  {form.productBanners && (
                    <button
                      onClick={() => handleRemoveFile("productBanners")}
                      className="text-red-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ---- TEXTAREAS ---- */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                rows={4}
                value={form.instructions}
                onChange={(e) =>
                  dispatch(setFormData({ instructions: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="How to use…"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  dispatch(setFormData({ description: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="Full product description…"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300 resize-y"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Directions for Use
              </label>
              <textarea
                rows={4}
                value={form.directionsForUse}
                onChange={(e) =>
                  dispatch(setFormData({ directionsForUse: e.target.value }))
                }
                disabled={isSubmitting}
                placeholder="Step-by-step usage instructions..."
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-300 resize-y"
              />
            </div>
          </div>

          {/* ---- TAG INPUTS ---- */}
          <div className="space-y-6 mb-6">
            <TagInput
              label="Key Ingredients"
              value={form.keyIngredients || ""}
              field="keyIngredients"
              placeholder="Type ingredient and press Enter"
            />
            <TagInput
              label="Key Benefits"
              value={form.keyBenefits || ""}
              field="keyBenefits"
              placeholder="Type benefit and press Enter"
            />
            <TagInput
              label="Cautions & Disclaimers"
              value={form.cautionsAndDisclaimers || ""}
              field="cautionsAndDisclaimers"
              placeholder="Type caution and press Enter"
            />
            <TagInput
              label="FDA Disclaimer"
              value={form.cautionsfdaDisclaimer || ""}
              field="cautionsfdaDisclaimer"
              placeholder="e.g. These statements have not been evaluated..."
            />
            <TagInput
              label="Patents & Certifications"
              value={form.patentsAndCertifications || ""}
              field="patentsAndCertifications"
              placeholder="e.g. USDA Organic, Patent #123456"
            />
            <TagInput
              label="Allergy Info"
              value={form.allergyInfo || ""}
              field="allergyInfo"
              placeholder="e.g. Contains nuts"
            />
            <TagInput
              label="Free Of"
              value={form.freeOf || ""}
              field="freeOf"
              placeholder="e.g. Gluten, Dairy, GMOs"
            />
          </div>

          {/* ---- SAVE / CANCEL ---- */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting && (
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
              )}
              {isSubmitting
                ? "Saving…"
                : isEditing
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditor;