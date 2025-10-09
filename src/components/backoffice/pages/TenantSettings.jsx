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
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle, Info, Copy, ExternalLink, RefreshCw } from 'lucide-react';

const TenantSettings = () => {
  const navigate = useNavigate();
  const { loading, error, getAll, put } = useTenantApi();
  const [tenantId, setTenantId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [websiteStep, setWebsiteStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [showDNSInstructions, setShowDNSInstructions] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const [websiteData, setWebsiteData] = useState({
    domain_type: 'sub_domain',
    custom_domain: '',
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

      setSettings(settingsData);
      setWebsiteData({
        domain_type: settingsData.domain_type || 'sub_domain',
        custom_domain: settingsData.custom_domain || '',
        first_name: settingsData.first_name || '',
        last_name: settingsData.last_name || '',
        email_id: settingsData.email_id || '',
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

      if (response.message) {
        showSuccessToast(response.message);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setSettings({});
      handleAPIError(err);
    }
  }, [tenantId, getAll]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Enhanced error handler
  const handleAPIError = (err) => {
    const errorData = err.response?.data;
    const errorCode = errorData?.error;
    const errorMessage = errorData?.message;
    const validationErrors = errorData?.errors;

    if (validationErrors && Array.isArray(validationErrors)) {
      setValidationErrors(validationErrors.map(e => ({ msg: e.msg || e.message })));
      showErrorToast('Please fix the validation errors');
      return;
    }

    switch (errorCode) {
      case 'SUBDOMAIN_EXISTS':
      case 'DOMAIN_EXISTS':
        setValidationErrors([{ msg: errorMessage || 'This domain is already taken' }]);
        setWebsiteStep(0);
        break;
      case 'INVALID_DOMAIN':
        setValidationErrors([{ msg: errorMessage || 'Invalid domain format' }]);
        setWebsiteStep(0);
        break;
      case 'UNAUTHORIZED':
        showErrorToast('You are not authorized to perform this action');
        navigate('/backoffice-login');
        break;
      case 'TENANT_NOT_FOUND':
        showErrorToast('Tenant not found');
        navigate('/backoffice-login');
        break;
      case 'VERIFICATION_ERROR':
        setValidationErrors([{ msg: errorMessage || 'Domain verification failed' }]);
        break;
      case 'UPLOAD_ERROR':
        setValidationErrors([{ msg: errorMessage || 'Failed to upload logo' }]);
        setWebsiteStep(2);
        break;
      default:
        setValidationErrors([{ msg: errorMessage || 'An error occurred. Please try again.' }]);
    }

    showErrorToast(errorMessage || 'Operation failed');
  };

  // Copy to clipboard helper
  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      showSuccessToast(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(''), 2000);
    });
  };

  // Handle form input changes
  const handleWebsiteDataChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'email_id') return;

    setWebsiteData((prev) => ({
      ...prev,
      [name]: files ? files[0] : type === 'checkbox' ? checked : value,
    }));
    setValidationErrors([]);
  };

  // Handle domain type change
  const handleDomainTypeChange = (value) => {
    setWebsiteData((prev) => ({
      ...prev,
      domain_type: value,
      custom_domain: value === 'sub_domain' ? '' : prev.custom_domain,
    }));
    setValidationErrors([]);
    setShowDNSInstructions(false);
  };

  // Validate form steps
  const validateStep = () => {
    const errors = [];

    if (websiteStep === 0) {
      if (websiteData.domain_type === 'custom_domain') {
        if (!websiteData.custom_domain) {
          errors.push({ msg: 'Custom domain is required' });
        } else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(websiteData.custom_domain)) {
          errors.push({ msg: 'Invalid domain format (e.g., example.com)' });
        }
      }
    } else if (websiteStep === 1) {
      if (!websiteData.first_name?.trim()) {
        errors.push({ msg: 'First name is required' });
      }
      if (!websiteData.address?.trim()) {
        errors.push({ msg: 'Address is required' });
      }
      if (websiteData.mobile && !/^\+?[1-9]\d{1,14}$/.test(websiteData.mobile)) {
        errors.push({ msg: 'Invalid mobile number format (e.g., +1234567890)' });
      }
    } else if (websiteStep === 2) {
      if (!websiteData.site_name?.trim()) {
        errors.push({ msg: 'Site name is required' });
      }
      if (websiteData.site_logo) {
        if (websiteData.site_logo.size > 4 * 1024 * 1024) {
          errors.push({ msg: 'Site logo must be less than 4MB' });
        }
        if (!/image\/(jpeg|jpg|png)/.test(websiteData.site_logo.type)) {
          errors.push({ msg: 'Site logo must be JPEG, JPG, or PNG format' });
        }
      }
    } else if (websiteStep === 3) {
      const urlPattern = /^https?:\/\/.+/;
      if (websiteData.nht_website_link && !urlPattern.test(websiteData.nht_website_link)) {
        errors.push({ msg: 'NHT Website Link must be a valid URL' });
      }
      if (websiteData.nht_store_link && !urlPattern.test(websiteData.nht_store_link)) {
        errors.push({ msg: 'NHT Store Link must be a valid URL' });
      }
      if (websiteData.nht_joining_link && !urlPattern.test(websiteData.nht_joining_link)) {
        errors.push({ msg: 'NHT Joining Link must be a valid URL' });
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
      } else if (key === 'publish_on_site') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined && key !== 'dns_status') {
        formData.append(key, value);
      }
    });

    try {
      const response = await put(`/tenants/${tenantId}/settings`, formData, true);
      setSettings(response.settings);
      showSuccessToast(response.message || 'Settings updated successfully');

      if (response.verification) {
        setVerificationData(response.verification);
        setShowDNSInstructions(true);
        setWebsiteStep(0); // Stay on domain step for DNS setup
      } else {
        setShowForm(false);
        setWebsiteStep(0);
      }

      setValidationErrors([]);
      await fetchSettings();
    } catch (err) {
      console.error('Update error:', err);
      handleAPIError(err);
    }
  };

  // Refresh DNS status
  const refreshDNSStatus = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/settings`);
      const settingsData = response.settings || {};
      setSettings(settingsData);
      setWebsiteData((prev) => ({
        ...prev,
        dns_status: settingsData.dns_status || 'pending',
      }));
      showSuccessToast('DNS status refreshed');
    } catch (err) {
      showErrorToast('Failed to refresh DNS status');
    }
  };

  // Form navigation
  const nextStep = () => {
    const errors = validateStep();
    if (!errors.length) {
      setWebsiteStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      setValidationErrors(errors);
    }
  };

  const prevStep = () => {
    setWebsiteStep((prev) => Math.max(prev - 1, 0));
    setValidationErrors([]);
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setWebsiteStep(0);
    setValidationErrors([]);
    setVerificationData(null);
    setShowDNSInstructions(false);
    setWebsiteData({
      domain_type: settings?.domain_type || 'sub_domain',
      custom_domain: settings?.custom_domain || '',
      first_name: settings?.first_name || '',
      last_name: settings?.last_name || '',
      email_id: settings?.email_id || '',
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

  // Render DNS instructions (specific, after submission)
  const renderDNSInstructions = () => {
    if (!verificationData || !showDNSInstructions) return null;

    const { instructions, note, domain } = verificationData;

    return (
      <div className="max-w-6xl mx-auto mt-8 text-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Configure DNS for {domain}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">{note}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: TXT Record */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">{instructions.step1.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{instructions.step1.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                    {instructions.step1.host}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(instructions.step1.host, 'Host')}
                    className="h-7"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                    {instructions.step1.value}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(instructions.step1.value, 'Value')}
                    className="h-7"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{instructions.step1.description}</p>
            </CardContent>
          </Card>

          {/* Step 2: CNAME Record */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">{instructions.step2.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{instructions.step2.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                    {instructions.step2.host}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(instructions.step2.host, 'Host')}
                    className="h-7"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                    {instructions.step2.value}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(instructions.step2.value, 'Value')}
                    className="h-7"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{instructions.step2.description}</p>
            </CardContent>
          </Card>

          {/* Step 3: A Record (Alternative) */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">{instructions.step3_alternative.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{instructions.step3_alternative.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                  {domain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                    {instructions.step3_alternative.value}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(instructions.step3_alternative.value, 'IP Address')}
                    className="h-7"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{instructions.step3_alternative.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setShowDNSInstructions(false);
              setShowForm(false);
              setWebsiteStep(0);
            }}
            className="w-32"
          >
            Close
          </Button>
          <Button
            onClick={refreshDNSStatus}
            disabled={loading}
            className="w-32 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Check DNS
          </Button>
        </div>
      </div>
    );
  };

  // Render general DNS preview instructions (shown on select custom_domain, before submission)
  const renderGeneralDNSPreview = () => {
    const domain = websiteData.custom_domain || 'yourdomain.com';
    const baseDomain = 'igrowbig.com';
    const serverIP = '139.59.8.68';

    return (
      <div className="max-w-6xl mx-auto mt-8 text-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold">DNS Setup for Your Custom Domain</h2>
        </div>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          After saving, you'll receive a unique verification token via email and here.
          Use it to configure your DNS. DNS changes can take up to 48 hours to propagate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">Step 1: TXT Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">TXT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                  _igrowbig-verification.{domain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 truncate w-[180px]">
                  [Token after saving]
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Add TXT to verify domain ownership.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">Step 2: CNAME Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">CNAME</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                  {domain.replace(/^www\./, '')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                  {baseDomain}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recommended for easy traffic routing.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">Step 3: A Record (Alternative)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                  {domain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate w-[180px]">
                  {serverIP}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use if CNAME doesn’t work.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Render validation errors
  const renderValidationErrors = () =>
    validationErrors.length > 0 && (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Please fix the following errors:</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4 mt-2">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err.msg}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );

  // Steps configuration
  const steps = [
    'Domain Setup',
    'Contact Info',
    'Branding',
    'Distributor Links',
    'Review',
  ];

  // Render form steps
  const renderWebsiteStep = () => {
    switch (websiteStep) {
      case 0:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            {renderDNSInstructions()}

            <div>
              <Label htmlFor="domain_type">Domain Type</Label>
              <Select
                value={websiteData.domain_type}
                onValueChange={handleDomainTypeChange}
                disabled={loading}
              >
                <SelectTrigger id="domain_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub_domain">Subdomain (free)</SelectItem>
                  <SelectItem value="custom_domain">Custom Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {websiteData.domain_type === 'custom_domain' && (
              <div>
                <Label htmlFor="custom_domain">
                  Custom Domain <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="custom_domain"
                  name="custom_domain"
                  value={websiteData.custom_domain}
                  onChange={handleWebsiteDataChange}
                  placeholder="example.com"
                  disabled={loading}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter your domain without www (e.g., example.com)
                </p>
              </div>
            )}

            {websiteData.domain_type === 'custom_domain' && renderGeneralDNSPreview()}

            {websiteData.domain_type === 'sub_domain' && settings?.subdomain && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Your Store URL</AlertTitle>
                <AlertDescription className="text-green-800">
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-sm">
                      https://{settings.subdomain}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://${settings.subdomain}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {websiteData.dns_status && websiteData.domain_type === 'custom_domain' && (
              <div className="flex items-center gap-4">
                <div>
                  <Label>DNS Status</Label>
                  <Badge
                    className={
                      websiteData.dns_status === 'verified'
                        ? 'bg-green-500'
                        : websiteData.dns_status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }
                  >
                    {websiteData.dns_status === 'verified' ? '✅ Verified' : 
                     websiteData.dns_status === 'pending' ? '⏳ Pending' : '❌ Unverified'}
                  </Badge>
                </div>
                {websiteData.dns_status !== 'verified' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshDNSStatus}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Status
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-600">
              This information will appear on your website's contact page.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={websiteData.first_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={websiteData.last_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email_id">Email</Label>
              <Input
                id="email_id"
                name="email_id"
                value={websiteData.email_id}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={websiteData.mobile}
                onChange={handleWebsiteDataChange}
                placeholder="+1234567890"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={websiteData.address}
                onChange={handleWebsiteDataChange}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="skype">Skype</Label>
              <Input
                id="skype"
                name="skype"
                value={websiteData.skype}
                onChange={handleWebsiteDataChange}
                placeholder="skype_username"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="publish_on_site"
                name="publish_on_site"
                type="checkbox"
                checked={websiteData.publish_on_site}
                onChange={handleWebsiteDataChange}
                className="h-4 w-4"
                disabled={loading}
              />
              <Label htmlFor="publish_on_site" className="font-normal">
                Publish contact info on website
              </Label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-600">
              Customize your store's branding with a name and logo.
            </p>

            <div>
              <Label htmlFor="site_name">
                Site Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="site_name"
                name="site_name"
                value={websiteData.site_name}
                onChange={handleWebsiteDataChange}
                placeholder="My Store"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="site_logo">Site Logo</Label>
              <Input
                id="site_logo"
                name="site_logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleWebsiteDataChange}
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG or JPEG (max 4MB, 170×65px recommended)
              </p>

              {websiteData.site_logo && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {websiteData.site_logo.name}
                </p>
              )}

              {settings?.site_logo_url && !websiteData.site_logo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Current logo:</p>
                  <img
                    src={settings.site_logo_url}
                    alt="Current Logo"
                    className="h-16 w-auto object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-600">
              Connect your NHT Global distributor links (optional).
            </p>

            <div>
              <Label htmlFor="nht_website_link">NHT Website Link</Label>
              <Input
                id="nht_website_link"
                name="nht_website_link"
                value={websiteData.nht_website_link}
                onChange={handleWebsiteDataChange}
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="nht_store_link">NHT Store Link</Label>
              <Input
                id="nht_store_link"
                name="nht_store_link"
                value={websiteData.nht_store_link}
                onChange={handleWebsiteDataChange}
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="nht_joining_link">NHT Joining Link</Label>
              <Input
                id="nht_joining_link"
                name="nht_joining_link"
                value={websiteData.nht_joining_link}
                onChange={handleWebsiteDataChange}
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-lg font-medium">Review your settings</p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Domain</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {websiteData.domain_type === 'custom_domain' ? 'Custom Domain' : 'Subdomain'}
                </span>
                {websiteData.domain_type === 'custom_domain' && websiteData.custom_domain && (
                  <>
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-medium">{websiteData.custom_domain}</span>
                  </>
                )}
                {websiteData.domain_type === 'sub_domain' && settings?.subdomain && (
                  <>
                    <span className="text-gray-600">URL:</span>
                    <span className="font-medium">https://{settings.subdomain}</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {websiteData.first_name} {websiteData.last_name}
                </span>
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{websiteData.email_id}</span>
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{websiteData.mobile || 'Not set'}</span>
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{websiteData.address || 'Not set'}</span>
                <span className="text-gray-600">Skype:</span>
                <span className="font-medium">{websiteData.skype || 'Not set'}</span>
                <span className="text-gray-600">Publish:</span>
                <span className="font-medium">
                  {websiteData.publish_on_site ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Branding</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Site Name:</span>
                <span className="font-medium">{websiteData.site_name}</span>
                <span className="text-gray-600">Logo:</span>
                <span className="font-medium">
                  {websiteData.site_logo
                    ? `New: ${websiteData.site_logo.name}`
                    : settings?.site_logo_url
                    ? 'Current logo'
                    : 'Not set'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Distributor Links</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Website:</span>
                <span className="font-medium break-all">
                  {websiteData.nht_website_link || 'Not set'}
                </span>
                <span className="text-gray-600">Store:</span>
                <span className="font-medium break-all">
                  {websiteData.nht_store_link || 'Not set'}
                </span>
                <span className="text-gray-600">Joining:</span>
                <span className="font-medium break-all">
                  {websiteData.nht_joining_link || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (!tenantId) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to view settings.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <ToastNotification />

      {loading && !settings && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      )}

      {error && !settings && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Settings</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to load settings. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* View Mode */}
      {!showForm && settings && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Store Settings</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              Edit Settings
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Domain Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Domain Type:</span>
                    <p className="mt-1">
                      {settings.domain_type === 'custom_domain' ? 'Custom Domain' : 'Subdomain'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Website URL:</span>
                    <p className="mt-1 flex items-center gap-2">
                      <span className="font-mono">{settings.website_link}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(settings.website_link, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </p>
                  </div>
                  {settings.custom_domain && (
                    <>
                      <div>
                        <span className="font-medium text-gray-600">Custom Domain:</span>
                        <p className="mt-1">{settings.custom_domain}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">DNS Status:</span>
                        <div className="mt-1">
                          <Badge
                            className={
                              settings.dns_status === 'verified'
                                ? 'bg-green-500'
                                : settings.dns_status === 'pending'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }
                          >
                            {settings.dns_status === 'verified' ? '✅ Verified' : 
                             settings.dns_status === 'pending' ? '⏳ Pending Verification' : '❌ Unverified'}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="mt-1">
                      {settings.first_name} {settings.last_name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="mt-1">{settings.email_id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Mobile:</span>
                    <p className="mt-1">{settings.mobile || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Address:</span>
                    <p className="mt-1">{settings.address || 'Not set'}</p>
                  </div>
                  {settings.skype && (
                    <div>
                      <span className="font-medium text-gray-600">Skype:</span>
                      <p className="mt-1">{settings.skype}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Published on Site:</span>
                    <p className="mt-1">{settings.publish_on_site ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Site Name:</span>
                    <p className="mt-1">{settings.site_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Site Logo:</span>
                    {settings.site_logo_url ? (
                      <img
                        src={settings.site_logo_url}
                        alt="Site Logo"
                        className="h-16 w-auto object-contain mt-2 border rounded"
                      />
                    ) : (
                      <p className="mt-1 text-gray-500">Not set</p>
                    )}
                  </div>
                </div>
              </div>

              {(settings.nht_website_link || settings.nht_store_link || settings.nht_joining_link) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Distributor Links</h3>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {settings.nht_website_link && (
                      <div>
                        <span className="font-medium text-gray-600">NHT Website:</span>
                        <p className="mt-1 text-blue-600 hover:underline">
                          <a href={settings.nht_website_link} target="_blank" rel="noopener noreferrer">
                            {settings.nht_website_link}
                          </a>
                        </p>
                      </div>
                    )}
                    {settings.nht_store_link && (
                      <div>
                        <span className="font-medium text-gray-600">NHT Store:</span>
                        <p className="mt-1 text-blue-600 hover:underline">
                          <a href={settings.nht_store_link} target="_blank" rel="noopener noreferrer">
                            {settings.nht_store_link}
                          </a>
                        </p>
                      </div>
                    )}
                    {settings.nht_joining_link && (
                      <div>
                        <span className="font-medium text-gray-600">NHT Joining:</span>
                        <p className="mt-1 text-blue-600 hover:underline">
                          <a href={settings.nht_joining_link} target="_blank" rel="noopener noreferrer">
                            {settings.nht_joining_link}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Mode */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Edit Store Settings</CardTitle>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div
                      className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm font-medium transition-colors ${
                        idx < websiteStep
                          ? 'bg-green-500 text-white'
                          : idx === websiteStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx < websiteStep ? '✓' : idx + 1}
                    </div>
                    <p className="text-xs mt-2 font-medium">{step}</p>
                  </div>
                ))}
              </div>

              <Progress value={(websiteStep / (steps.length - 1)) * 100} className="h-2" />

              <div className="min-h-[400px]">
                {renderWebsiteStep()}
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={websiteStep === 0 || loading}
                  className="w-32"
                >
                  Previous
                </Button>
                <Button
                  onClick={websiteStep === steps.length - 1 ? updateWebsiteDetails : nextStep}
                  disabled={loading}
                  className="w-32"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : websiteStep === steps.length - 1 ? (
                    'Save Settings'
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