import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useTenantApi from '@/hooks/useTenantApi';
import ToastNotification, { showSuccessToast, showErrorToast } from '../../ToastNotification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';

const TenantSettings = () => {
  const navigate = useNavigate();
  const { loading, error, getAll, put } = useTenantApi();
  const [tenantId, setTenantId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [websiteStep, setWebsiteStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [websiteData, setWebsiteData] = useState({
    domain_type: 'sub_domain',
    primary_domain_name: 'begrat.com',
    sub_domain: '',
    website_link: '',
    first_name: '',
    last_name: '',
    email_id: '',
    mobile: '',
    address: '',
    skype: '',
    site_name: '',
    site_logo: null,
    nht_website_link: '',
    nht_store_link: '',
    nht_joining_link: '',
    dns_status: 'pending',
    publish_on_site: false,
  });

  // Authentication check
  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenant_id');
    const token = localStorage.getItem('token');
    if (!token || !storedTenantId) {
      showErrorToast('Please log in to continue');
      navigate('/backoffice-login');
    } else {
      setTenantId(storedTenantId);
    }
  }, [navigate]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    if (!tenantId) return;
    try {
      const response = await getAll(`/tenants/${tenantId}/settings`);
      const settingsData = response.settings || {};
      console.log('Fetched Settings:', settingsData); // Debug log
      setSettings(settingsData);
      setWebsiteData({
        domain_type: settingsData.domain_type || 'sub_domain',
        primary_domain_name: settingsData.primary_domain_name || 'begrat.com',
        sub_domain: settingsData.sub_domain || '',
        website_link: settingsData.website_link || '',
        first_name: settingsData.first_name || '',
        last_name: settingsData.last_name || '',
        email_id: settingsData.email_id || 'N/A', // Fallback for email_id
        mobile: settingsData.mobile || '',
        address: settingsData.address || '',
        skype: settingsData.skype || '',
        site_name: settingsData.site_name || '',
        site_logo: null,
        nht_website_link: settingsData.nht_website_link || '',
        nht_store_link: settingsData.nht_store_link || '',
        nht_joining_link: settingsData.nht_joining_link || '',
        dns_status: settingsData.dns_status || 'pending',
        publish_on_site: !!settingsData.publish_on_site,
      });
      showSuccessToast(response.message || 'Settings fetched successfully');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setSettings({});
      showErrorToast(err.message || 'Failed to fetch tenant settings');
    }
  }, [tenantId, getAll]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle form input changes
  const handleWebsiteDataChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'email_id') return; // Prevent email_id changes
    setWebsiteData((prev) => {
      const updated = {
        ...prev,
        [name]: files ? files[0] : type === 'checkbox' ? checked : value,
      };
      if (['domain_type', 'sub_domain', 'primary_domain_name'].includes(name)) {
        const protocol = window.location.protocol;
        updated.website_link =
          updated.domain_type === 'sub_domain' && updated.sub_domain
            ? `${protocol}//${updated.sub_domain}.begrat.com`
            : `${protocol}//${updated.primary_domain_name || 'begrat.com'}`;
      }
      return updated;
    });
    setValidationErrors([]);
  };

  // Handle domain type change for Select component
  const handleDomainTypeChange = (value) => {
    setWebsiteData((prev) => {
      const updated = { ...prev, domain_type: value };
      const protocol = window.location.protocol;
      updated.website_link =
        updated.domain_type === 'sub_domain' && updated.sub_domain
          ? `${protocol}//${updated.sub_domain}.begrat.com`
          : `${protocol}//${updated.primary_domain_name || 'begrat.com'}`;
      return updated;
    });
    setValidationErrors([]);
  };

  // Validate form steps
  const validateStep = () => {
    const errors = [];
    if (websiteStep === 0) {
      if (websiteData.domain_type === 'sub_domain' && !websiteData.sub_domain) {
        errors.push({ msg: 'Sub-domain is required for sub-domain type' });
      } else if (
        websiteData.sub_domain &&
        !/^[a-zA-Z0-9-]+$/.test(websiteData.sub_domain)
      ) {
        errors.push({ msg: 'Sub-domain can only contain letters, numbers, and hyphens' });
      }
      if (
        websiteData.domain_type === 'custom_domain' &&
        !websiteData.primary_domain_name.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ) {
        errors.push({ msg: 'Invalid primary domain name' });
      }
    } else if (websiteStep === 1) {
      if (!websiteData.first_name) {
        errors.push({ msg: 'First name is required' });
      }
      if (!websiteData.address) {
        errors.push({ msg: 'Address is required' });
      }
      if (websiteData.mobile && !/^\+?[1-9]\d{1,14}$/.test(websiteData.mobile)) {
        errors.push({ msg: 'Invalid mobile number' });
      }
    } else if (websiteStep === 2) {
      if (!websiteData.site_name) {
        errors.push({ msg: 'Site name is required' });
      }
      if (websiteData.site_logo && websiteData.site_logo.size > 4 * 1024 * 1024) {
        errors.push({ msg: 'Site logo must be less than 4MB' });
      }
      if (
        websiteData.site_logo &&
        !/image\/(jpeg|jpg|png)/.test(websiteData.site_logo.type)
      ) {
        errors.push({ msg: 'Site logo must be JPEG/JPG/PNG' });
      }
    }
    return errors;
  };

  // Update settings
  const updateWebsiteDetails = async () => {
    const errors = validateStep();
    if (errors.length) {
      setValidationErrors(errors);
      return;
    }

    const formData = new FormData();
    Object.entries(websiteData).forEach(([key, value]) => {
      if (key === 'site_logo' && value) {
        formData.append(key, value);
      } else if (
        value !== null &&
        value !== undefined &&
        key !== 'website_link' &&
        key !== 'dns_status' &&
        key !== 'email_id' // Exclude email_id from updates
      ) {
        formData.append(key, value);
      }
    });

    try {
      const response = await put(`/tenants/${tenantId}/settings`, formData, true);
      setSettings(response.settings);
      showSuccessToast(response.message || 'Settings updated successfully');
      setShowForm(false);
      setWebsiteStep(0);
      setValidationErrors([]);
      fetchSettings(); // Refresh settings
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update settings';
      if (err.response?.data?.error === 'SUBDOMAIN_EXISTS') {
        setValidationErrors([{ msg: 'Subdomain already taken' }]);
        setWebsiteStep(0);
      } else if (err.response?.data?.error === 'DOMAIN_EXISTS') {
        setValidationErrors([{ msg: 'Domain already taken' }]);
        setWebsiteStep(0);
      } else {
        setValidationErrors([{ msg: errorMsg }]);
      }
      showErrorToast(errorMsg);
    }
  };

  // Form navigation
  const nextStep = () => {
    const errors = validateStep();
    if (!errors.length) setWebsiteStep((prev) => Math.min(prev + 1, steps.length - 1));
    else setValidationErrors(errors);
  };

  const prevStep = () => setWebsiteStep((prev) => Math.max(prev - 1, 0));

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setWebsiteStep(0);
    setValidationErrors([]);
    setWebsiteData({
      domain_type: settings?.domain_type || 'sub_domain',
      primary_domain_name: settings?.primary_domain_name || 'begrat.com',
      sub_domain: settings?.sub_domain || '',
      website_link: settings?.website_link || '',
      first_name: settings?.first_name || '',
      last_name: settings?.last_name || '',
      email_id: settings?.email_id || 'N/A',
      mobile: settings?.mobile || '',
      address: settings?.address || '',
      skype: settings?.skype || '',
      site_name: settings?.site_name || '',
      site_logo: null,
      nht_website_link: settings?.nht_website_link || '',
      nht_store_link: settings?.nht_store_link || '',
      nht_joining_link: settings?.nht_joining_link || '',
      dns_status: settings?.dns_status || 'pending',
      publish_on_site: !!settings?.publish_on_site,
    });
  };

  // Render validation errors
  const renderValidationErrors = () =>
    validationErrors.length > 0 && (
      <Alert variant="destructive" className="mb-6 bg-gray-100 text-black border-black">
        <AlertTriangle className="h-4 w-4 text-black" />
        <AlertTitle>Validation Errors</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err.msg}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );

  // Render multi-step form
  const steps = [
    'Domain Details',
    'Agent Information',
    'Site Identity',
    'Distributor Links',
    'Review & Update',
  ];

  const renderWebsiteStep = () => {
    switch (websiteStep) {
      case 0: // Domain Details
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <div>
              <Label htmlFor="domain_type" className="text-black">Domain Type</Label>
              <Select
                value={websiteData.domain_type}
                onValueChange={handleDomainTypeChange}
                disabled={loading}
              >
                <SelectTrigger id="domain_type" className="border-black text-black bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border-black">
                  <SelectItem value="sub_domain">Sub Domain</SelectItem>
                  <SelectItem value="custom_domain">Custom Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="primary_domain_name" className="text-black">
                Primary Domain Name <span className="text-black">*</span>
              </Label>
              <Input
                id="primary_domain_name"
                name="primary_domain_name"
                value={websiteData.primary_domain_name}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., mydomain.com"
                disabled={loading || websiteData.domain_type === 'sub_domain'}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
              {websiteData.domain_type === 'custom_domain' && (
                <div className="mt-2 p-4 bg-gray-100 rounded-md border border-black">
                  <p className="text-sm text-black font-medium">DNS Setup Instructions:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    To use your custom domain, configure an A record in your DNS settings pointing to:
                  </p>
                  <p className="text-sm font-mono text-black mt-1">139.59.3.58</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This may take up to 48 hours to propagate. Check the DNS status below.
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="sub_domain" className="text-black">
                Sub-Domain {websiteData.domain_type === 'sub_domain' && <span className="text-black">*</span>}
              </Label>
              <Input
                id="sub_domain"
                name="sub_domain"
                value={websiteData.sub_domain}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., priti"
                disabled={websiteData.domain_type !== 'sub_domain' || loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
              {websiteData.domain_type === 'sub_domain' && websiteData.sub_domain && (
                <p className="text-sm text-gray-600 mt-1">
                  Your store: {websiteData.sub_domain}.begrat.com
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="website_link" className="text-black">Website Link</Label>
              <Input
                id="website_link"
                name="website_link"
                value={websiteData.website_link}
                disabled
                className="border-black text-black bg-gray-200"
              />
            </div>
            <div>
              <Label className="text-black">DNS Status</Label>
              <Badge
                className={
                  {
                    pending: 'bg-gray-300 text-black',
                    verified: 'bg-black text-white',
                    unverified: 'bg-gray-500 text-white',
                    error: 'bg-gray-700 text-white',
                  }[websiteData.dns_status] || 'bg-gray-300 text-black'
                }
              >
                {websiteData.dns_status === 'verified'
                  ? '✅ Active'
                  : websiteData.dns_status === 'unverified'
                  ? '❌ Unverified'
                  : websiteData.dns_status === 'error'
                  ? '⚠️ Error'
                  : '⏳ Pending'}
              </Badge>
            </div>
          </div>
        );
      case 1: // Agent Information
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-600">This information will appear on your website’s Contact page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-black">
                  First Name <span className="text-black">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={websiteData.first_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                  className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-black">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={websiteData.last_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                  className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email_id" className="text-black">
                Email ID <span className="text-black">*</span>
              </Label>
              <Input
                id="email_id"
                name="email_id"
                type="email"
                value={websiteData.email_id}
                disabled
                className="border-black text-black bg-gray-200"
              />
              <p className="text-sm text-gray-600 mt-1">This email cannot be changed.</p>
            </div>
            <div>
              <Label htmlFor="mobile" className="text-black">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={websiteData.mobile}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., +1234567890"
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-black">
                Address <span className="text-black">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={websiteData.address}
                onChange={handleWebsiteDataChange}
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="skype" className="text-black">Skype</Label>
              <Input
                id="skype"
                name="skype"
                value={websiteData.skype}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., skype_id"
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="publish_on_site" className="text-black">Publish on Site</Label>
              <input
                id="publish_on_site"
                name="publish_on_site"
                type="checkbox"
                checked={websiteData.publish_on_site}
                onChange={handleWebsiteDataChange}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black disabled:opacity-50"
                disabled={loading}
              />
            </div>
          </div>
        );
      case 2: // Site Identity
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-600">
              Use a logo with your site name (PNG/JPG, max 4MB, 170px × 65px recommended).
            </p>
            <div>
              <Label htmlFor="site_name" className="text-black">
                Site Name <span className="text-black">*</span>
              </Label>
              <Input
                id="site_name"
                name="site_name"
                value={websiteData.site_name}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., My Site"
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="site_logo" className="text-black">Site Logo</Label>
              <Input
                id="site_logo"
                name="site_logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleWebsiteDataChange}
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
              {websiteData.site_logo && (
                <p className="text-sm text-gray-600 mt-1">Selected: {websiteData.site_logo.name}</p>
              )}
              {settings?.site_logo_url && !websiteData.site_logo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Logo:</p>
                  <img
                    src={settings.site_logo_url}
                    alt="Current Logo"
                    className="h-16 w-auto object-contain rounded-md border border-black"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3: // Distributor Links
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <div>
              <Label htmlFor="nht_website_link" className="text-black">NHT Website Link</Label>
              <Input
                id="nht_website_link"
                name="nht_website_link"
                value={websiteData.nht_website_link}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., http://begrat.com"
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
              <p className="text-sm text-gray-600 mt-1">
                Updates your store and joining link for visitors.{' '}
                <a href="#" className="text-black hover:underline">
                  How to find link
                </a>
              </p>
            </div>
            <div>
              <Label htmlFor="nht_store_link" className="text-black">NHT Store Link</Label>
              <Input
                id="nht_store_link"
                name="nht_store_link"
                value={websiteData.nht_store_link}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., http://begrat.com"
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
              <p className="text-sm text-gray-600 mt-1">
                Takes visitors to the NHT Global Store.{' '}
                <a href="#" className="text-black hover:underline">
                  How to find link
                </a>
              </p>
            </div>
            <div>
              <Label htmlFor="nht_joining_link" className="text-black">NHT Joining Link</Label>
              <Input
                id="nht_joining_link"
                name="nht_joining_link"
                value={websiteData.nht_joining_link}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., http://begrat.com"
                disabled={loading}
                className="border-black text-black bg-white disabled:bg-gray-200 disabled:text-gray-500"
              />
              <p className="text-sm text-gray-600 mt-1">
                Takes visitors to the NHT Global New Member Joining Link.{' '}
                <a href="#" className="text-black hover:underline">
                  How to find link
                </a>
              </p>
            </div>
          </div>
        );
      case 4: // Review & Update
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-lg font-medium text-black">Review your details and click "Update" to save.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {Object.entries(websiteData).map(([key, value]) => (
                key !== 'site_logo' && key !== 'website_link' && key !== 'dns_status' && (
                  <div key={key} className="flex flex-col">
                    <span className="font-medium text-black capitalize">{key.replace('_', ' ')}:</span>
                    <span>{key === 'publish_on_site' ? (value ? 'Yes' : 'No') : value || 'N/A'}</span>
                  </div>
                )
              ))}
              <div className="flex flex-col">
                <span className="font-medium text-black">Website Link:</span>
                <span>{websiteData.website_link || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-black">DNS Status:</span>
                <Badge
                  className={
                    {
                      pending: 'bg-gray-300 text-black',
                      verified: 'bg-black text-white',
                      unverified: 'bg-gray-500 text-white',
                      error: 'bg-gray-700 text-white',
                    }[websiteData.dns_status] || 'bg-gray-300 text-black'
                  }
                >
                  {websiteData.dns_status || 'N/A'}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-black">Site Logo:</span>
                <span>
                  {websiteData.site_logo
                    ? websiteData.site_logo.name
                    : settings?.site_logo_url
                    ? 'Current logo set'
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!tenantId) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <Alert variant="destructive" className="bg-gray-100 text-black border-black">
          <AlertTriangle className="h-4 w-4 text-black" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>Please log in to view settings.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" bg-white min-h-screen">
     
      <ToastNotification />

      {loading && !settings && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
        </div>
      )}

      {error && !settings && (
        <Alert variant="destructive" className="mb-6 bg-gray-100 text-black border-black">
          <AlertTriangle className="h-4 w-4 text-black" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message || 'Failed to load settings'}</AlertDescription>
        </Alert>
      )}

      {!showForm && settings && (
        <Card className="bg-white border-black">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-black">Current Settings</CardTitle>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Edit Settings
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {Object.entries(settings).map(([key, value]) => (
                key !== 'site_logo_url' && (
                  <div key={key} className="flex flex-col">
                    <span className="font-medium text-black capitalize">{key.replace('_', ' ')}:</span>
                    <span>
                      {key === 'publish_on_site'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : key === 'dns_status'
                        ? (
                            <Badge
                              className={
                                {
                                  pending: 'bg-gray-300 text-black',
                                  verified: 'bg-black text-white',
                                  unverified: 'bg-gray-500 text-white',
                                  error: 'bg-gray-700 text-white',
                                }[value] || 'bg-gray-300 text-black'
                              }
                            >
                              {value || 'N/A'}
                            </Badge>
                          )
                        : value || 'N/A'}
                    </span>
                  </div>
                )
              ))}
              <div className="flex flex-col">
                <span className="font-medium text-black">Site Logo:</span>
                {settings.site_logo_url ? (
                  <img
                    src={settings.site_logo_url}
                    alt="Site Logo"
                    className="h-16 w-auto object-contain rounded-md border border-black mt-1"
                  />
                ) : (
                  <span>N/A</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="bg-white border-black">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-black">Edit Tenant Settings</CardTitle>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={loading}
              className="flex items-center gap-2 border-black text-black hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 text-black" /> Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-medium ${
                        idx <= websiteStep ? 'bg-black text-white' : 'bg-gray-300 text-black'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <p className="text-sm mt-2 text-black">{step}</p>
                  </div>
                ))}
              </div>
              <Progress value={(websiteStep / (steps.length - 1)) * 100} className="h-2 bg-gray-300" />
              {renderWebsiteStep()}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={websiteStep === 0 || loading}
                  className="w-32 border-black text-black hover:bg-gray-100"
                >
                  Previous
                </Button>
                <Button
                  onClick={websiteStep === steps.length - 1 ? updateWebsiteDetails : nextStep}
                  disabled={loading}
                  className="w-32 bg-black text-white hover:bg-gray-800"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : websiteStep === steps.length - 1 ? (
                    'Update'
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantSettings;