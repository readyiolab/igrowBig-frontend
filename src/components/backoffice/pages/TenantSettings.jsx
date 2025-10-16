// src/components/TenantSettings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowLeft, AlertTriangle, CheckCircle, Info, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import ToastNotification, { showSuccessToast, showErrorToast } from '../../ToastNotification';

import {
  fetchTenantSettings,
  updateTenantSettings,
  refreshDNSStatus,
  setFormData,
  setFormField,
  setLogoFileName,
  setWebsiteStep,
  setValidationErrors,
  setVerificationData,
  setShowDNSInstructions,
  openForm,
  closeForm,
  clearError,
  selectTenantSettings,
  selectTenantForm,
  selectTenantLoading,
  selectTenantError,
  selectShowForm,
  selectWebsiteStep,
  selectValidationErrors,
  selectVerificationData,
  selectShowDNSInstructions,
  selectDNSLoading,
} from '@/store/slices/tenantSettingsSlice';

const TenantSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [tenantId, setTenantId] = useState(null);
  const [copiedField, setCopiedField] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  // Redux state
  const settings = useSelector(selectTenantSettings);
  const form = useSelector(selectTenantForm);
  const loading = useSelector(selectTenantLoading);
  const error = useSelector(selectTenantError);
  const showForm = useSelector(selectShowForm);
  const websiteStep = useSelector(selectWebsiteStep);
  const validationErrors = useSelector(selectValidationErrors);
  const verificationData = useSelector(selectVerificationData);
  const showDNSInstructions = useSelector(selectShowDNSInstructions);
  const dnsLoading = useSelector(selectDNSLoading);

  // Steps configuration
  const steps = [
    'Domain Setup',
    'Contact Info',
    'Branding',
    'Distributor Links',
    'Review',
  ];

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

  // Fetch settings when tenantId changes
  useEffect(() => {
    if (tenantId) {
      dispatch(fetchTenantSettings(tenantId)).catch((err) => {
        if (err?.status === 401) {
          showErrorToast('Session expired. Please log in again.');
          navigate('/backoffice-login');
        }
      });
    }
  }, [tenantId, dispatch, navigate]);

  // Handle error changes
  useEffect(() => {
    if (error) {
      handleAPIError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Enhanced error handler
  const handleAPIError = useCallback((err) => {
    const errorData = err;
    const errorCode = errorData?.error;
    const errorMessage = errorData?.message;
    const validationErrorsData = errorData?.errors;

    if (validationErrorsData && Array.isArray(validationErrorsData)) {
      dispatch(setValidationErrors(validationErrorsData.map(e => ({ msg: e.msg || e.message }))));
      showErrorToast('Please fix the validation errors');
      return;
    }

    let apiValidationErrors = [];

    switch (errorCode) {
      case 'SUBDOMAIN_EXISTS':
      case 'DOMAIN_EXISTS':
      case 'DOMAIN_TAKEN':
        apiValidationErrors = [{ msg: errorMessage || 'This domain is already taken' }];
        dispatch(setWebsiteStep(0));
        break;
      case 'INVALID_DOMAIN':
        apiValidationErrors = [{ msg: errorMessage || 'Invalid domain format' }];
        dispatch(setWebsiteStep(0));
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
      case 'VERIFICATION_FAILED':
        apiValidationErrors = [{ msg: errorMessage || 'Domain verification failed' }];
        break;
      case 'UPLOAD_ERROR':
        apiValidationErrors = [{ msg: errorMessage || 'Failed to upload logo' }];
        dispatch(setWebsiteStep(2));
        break;
      default:
        apiValidationErrors = [{ msg: errorMessage || 'An error occurred. Please try again.' }];
    }

    if (apiValidationErrors.length > 0) {
      dispatch(setValidationErrors(apiValidationErrors));
    }

    showErrorToast(errorMessage || 'Operation failed');
  }, [dispatch, navigate]);

  // Copy to clipboard helper
  const copyToClipboard = useCallback((text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      showSuccessToast(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(''), 2000);
    });
  }, []);

  // Handle form input changes
  const handleWebsiteDataChange = useCallback((e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'email_id') return;
    
    if (name === 'site_logo' && files && files[0]) {
      setLogoFile(files[0]);
      dispatch(setLogoFileName(files[0].name));
    } else {
      dispatch(setFormField({ name, value, type, checked }));
    }
    
    dispatch(setValidationErrors([]));
  }, [dispatch]);

  // Handle domain type change
  const handleDomainTypeChange = useCallback((value) => {
    dispatch(setFormData({
      domain_type: value,
      custom_domain: value === 'sub_domain' ? '' : form.custom_domain,
    }));
    dispatch(setValidationErrors([]));
    dispatch(setShowDNSInstructions(false));
  }, [dispatch, form.custom_domain]);

  // Validate form steps
  const validateStep = useCallback(() => {
    const errors = [];

    if (websiteStep === 0) {
      if (form.domain_type === 'custom_domain') {
        if (!form.custom_domain) {
          errors.push({ msg: 'Custom domain is required' });
        } else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.custom_domain)) {
          errors.push({ msg: 'Invalid domain format (e.g., example.com)' });
        }
      }
    } else if (websiteStep === 1) {
      if (!form.first_name?.trim()) {
        errors.push({ msg: 'First name is required' });
      }
      if (!form.address?.trim()) {
        errors.push({ msg: 'Address is required' });
      }
      if (form.mobile && !/^\+?[1-9]\d{1,14}$/.test(form.mobile)) {
        errors.push({ msg: 'Invalid mobile number format (e.g., +1234567890)' });
      }
    } else if (websiteStep === 2) {
      if (!form.site_name?.trim()) {
        errors.push({ msg: 'Site name is required' });
      }
      if (logoFile) {
        if (logoFile.size > 4 * 1024 * 1024) {
          errors.push({ msg: 'Site logo must be less than 4MB' });
        }
        if (!/image\/(jpeg|jpg|png)/.test(logoFile.type)) {
          errors.push({ msg: 'Site logo must be JPEG, JPG, or PNG format' });
        }
      }
    } else if (websiteStep === 3) {
      const urlPattern = /^https?:\/\/.+/;
      if (form.nht_website_link && !urlPattern.test(form.nht_website_link)) {
        errors.push({ msg: 'NHT Website Link must be a valid URL' });
      }
      if (form.nht_store_link && !urlPattern.test(form.nht_store_link)) {
        errors.push({ msg: 'NHT Store Link must be a valid URL' });
      }
      if (form.nht_joining_link && !urlPattern.test(form.nht_joining_link)) {
        errors.push({ msg: 'NHT Joining Link must be a valid URL' });
      }
    }

    return errors;
  }, [websiteStep, form, logoFile]);

  // Check if domain already verified
  const checkExistingDomain = useCallback(() => {
    if (!settings || !form.custom_domain) return false;
    
    if (settings.custom_domain === form.custom_domain && 
        settings.custom_domain_status === "verified") {
      showSuccessToast("This domain is already verified!");
      dispatch(closeForm());
      return true;
    }
    return false;
  }, [settings, form.custom_domain, dispatch]);

  // Update settings
  const updateWebsiteDetails = useCallback(async () => {
    const errors = validateStep();
    if (errors.length) {
      dispatch(setValidationErrors(errors));
      return;
    }

    if (!tenantId) {
      showErrorToast('Tenant ID not found. Please log in again.');
      navigate('/backoffice-login');
      return;
    }

    if (form.domain_type === 'custom_domain' && form.custom_domain) {
      const alreadyVerified = checkExistingDomain();
      if (alreadyVerified) return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'site_logo_name') {
        return;
      }
      if (key === 'publish_on_site') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined && 
                 key !== 'dns_status' && key !== 'custom_domain_status') {
        formData.append(key, value);
      }
    });

    if (logoFile) {
      formData.append('site_logo', logoFile);
    }

    try {
      const response = await dispatch(updateTenantSettings({ tenantId, formData })).unwrap();
      
      if (response.verification) {
        dispatch(setVerificationData(response.verification));
        dispatch(setShowDNSInstructions(true));
        dispatch(setWebsiteStep(0));
        showSuccessToast(response.message || 'Domain verification started. Check DNS instructions below.');
        setLogoFile(null);
      } else if (response.settings?.custom_domain_status === "verified") {
        showSuccessToast('Domain is already verified!');
        dispatch(closeForm());
        setLogoFile(null);
      } else {
        showSuccessToast(response.message || 'Settings updated successfully');
        dispatch(closeForm());
        setLogoFile(null);
      }
    } catch (err) {
      console.error('Update error:', err);
      // Don't call handleAPIError here - it's handled by useEffect
    }
  }, [validateStep, tenantId, form, logoFile, dispatch, navigate, checkExistingDomain]);

  // Refresh DNS status
  const handleRefreshDNSStatus = useCallback(async () => {
    if (!tenantId) return;
    try {
      const response = await dispatch(refreshDNSStatus(tenantId)).unwrap();
      if (response.settings?.custom_domain_status === 'verified') {
        showSuccessToast('Domain verified successfully! 🎉');
      } else {
        showSuccessToast('DNS status refreshed');
      }
    } catch (err) {
      showErrorToast('Failed to refresh DNS status');
    }
  }, [tenantId, dispatch]);

  // Form navigation
  const nextStep = useCallback(() => {
    const errors = validateStep();
    if (!errors.length) {
      dispatch(setWebsiteStep(Math.min(websiteStep + 1, steps.length - 1)));
    } else {
      dispatch(setValidationErrors(errors));
    }
  }, [validateStep, websiteStep, dispatch, steps.length]);

  const prevStep = useCallback(() => {
    dispatch(setWebsiteStep(Math.max(websiteStep - 1, 0)));
    dispatch(setValidationErrors([]));
  }, [websiteStep, dispatch]);

  const handleResetForm = useCallback(() => {
    dispatch(closeForm());
    setLogoFile(null);
  }, [dispatch]);

  // Render DNS instructions
  const renderDNSInstructions = useCallback(() => {
    const shouldShowInstructions = verificationData || 
      (settings?.custom_domain && settings?.custom_domain_status === "pending");

    if (!shouldShowInstructions) return null;

    // Build default instructions structure
    const defaultInstructions = {
      step1: { 
        title: "Step 1: Verify Domain Ownership",
        type: "TXT",
        host: `_igrowbig-verification.${settings?.custom_domain || 'yourdomain.com'}`,
        value: "Check your email for the verification token",
        description: "Add the TXT record sent to your email to verify domain ownership."
      },
      step2: {
        title: "Step 2: Point Domain to Platform", 
        type: "CNAME",
        host: settings?.custom_domain?.replace(/^www\./, '') || 'yourdomain.com',
        value: "igrowbig.com",
        description: "Routes traffic to our platform. Add after verification."
      },
      step3_alternative: {
        title: "Step 3: Alternative A Record",
        type: "A", 
        value: "139.59.8.68",
        description: "Use if your DNS provider doesn't support CNAME for root domain."
      }
    };

    const verification = verificationData || {
      domain: settings?.custom_domain,
      instructions: defaultInstructions,
      note: "Configure your DNS records to verify domain ownership. These instructions will remain visible until verification is complete."
    };

    // Ensure instructions exist and merge with defaults
    const instructions = verification.instructions || defaultInstructions;
    const note = verification.note || "Configure your DNS records to verify domain ownership. These instructions will remain visible until verification is complete.";
    const domain = verification.domain || settings?.custom_domain;

    // Safety check - if instructions still don't have the required properties, return null
    if (!instructions.step1 || !instructions.step2 || !instructions.step3_alternative) {
      return null;
    }

    return (
      <div className="max-w-6xl mx-auto mt-8 text-gray-900 bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Configure DNS for {domain || settings?.custom_domain}</h2>
          <Badge className="bg-yellow-500 text-white">⏳ Verification Pending</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{note}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                {instructions.step1.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{instructions.step1.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
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
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
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

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                {instructions.step2.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{instructions.step2.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
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
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
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

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900">
                {instructions.step3_alternative.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{instructions.step3_alternative.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Host:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
                  {domain || settings?.custom_domain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
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

        <Alert className="mt-6 bg-blue-50 border-blue-300">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">DNS Verification Status</AlertTitle>
          <AlertDescription className="text-blue-800">
            Your domain verification is in progress. These instructions will remain visible until your domain is fully verified.
            DNS changes can take up to 48 hours to propagate. Click "Check DNS" to verify status.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => {
              dispatch(setShowDNSInstructions(false));
              dispatch(closeForm());
            }}
            className="w-32"
          >
            Close
          </Button>
          <Button
            onClick={handleRefreshDNSStatus}
            disabled={dnsLoading || loading}
            className="w-32 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {dnsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check DNS
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }, [verificationData, settings, dnsLoading, loading, dispatch, copyToClipboard, handleRefreshDNSStatus]);

  // Render general DNS preview
  const renderGeneralDNSPreview = useCallback(() => {
    const domain = form.custom_domain || 'yourdomain.com';
    const baseDomain = 'igrowbig.com';
    const serverIP = '139.59.8.68';

    return (
      <div className="max-w-6xl mx-auto mt-8 text-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold">DNS Setup Preview</h2>
        </div>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          After saving, you'll receive a unique verification token via email.
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
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
                  _igrowbig-verification.{domain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 truncate max-w-[180px]">
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
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
                  {domain.replace(/^www\./, '')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
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
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
                  {domain}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Value:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-[180px]">
                  {serverIP}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Use if CNAME doesn't work.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }, [form.custom_domain]);

  // Render validation errors
  const renderValidationErrors = useCallback(() => 
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
    ), [validationErrors]);

  // Render form steps
  const renderWebsiteStep = useCallback(() => {
    switch (websiteStep) {
      case 0:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            {renderDNSInstructions()}

            <div>
              <Label htmlFor="domain_type">Domain Type</Label>
              <Select
                value={form.domain_type}
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

            {form.domain_type === 'custom_domain' && (
              <>
                <div>
                  <Label htmlFor="custom_domain">
                    Custom Domain <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="custom_domain"
                    name="custom_domain"
                    value={form.custom_domain}
                    onChange={handleWebsiteDataChange}
                    placeholder="example.com"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your domain without www (e.g., example.com)
                  </p>
                </div>

                {!showDNSInstructions && renderGeneralDNSPreview()}
              </>
            )}

            {form.domain_type === 'sub_domain' && settings?.subdomain && (
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

            {form.custom_domain_status && form.domain_type === 'custom_domain' && (
              <div className="flex items-center gap-4">
                <div>
                  <Label>DNS Status</Label>
                  <Badge
                    className={
                      form.custom_domain_status === 'verified'
                        ? 'bg-green-500'
                        : form.custom_domain_status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }
                  >
                    {form.custom_domain_status === 'verified' ? '✅ Verified' : 
                     form.custom_domain_status === 'pending' ? '⏳ Pending' : '❌ Unverified'}
                  </Badge>
                </div>
                {form.custom_domain_status !== 'verified' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefreshDNSStatus}
                    disabled={dnsLoading || loading}
                  >
                    {dnsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
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
                  value={form.first_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
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
                value={form.email_id}
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
                value={form.mobile}
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
                value={form.address}
                onChange={handleWebsiteDataChange}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="skype">Skype</Label>
              <Input
                id="skype"
                name="skype"
                value={form.skype}
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
                checked={form.publish_on_site}
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
                value={form.site_name}
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

              {logoFile && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {logoFile.name}
                </p>
              )}

              {settings?.site_logo_url && !logoFile && (
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
                value={form.nht_website_link}
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
                value={form.nht_store_link}
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
                value={form.nht_joining_link}
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
                  {form.domain_type === 'custom_domain' ? 'Custom Domain' : 'Subdomain'}
                </span>
                {form.domain_type === 'custom_domain' && form.custom_domain && (
                  <>
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-medium">{form.custom_domain}</span>
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      className={
                        form.custom_domain_status === 'verified'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }
                    >
                      {form.custom_domain_status === 'verified' ? '✅ Verified' : '⏳ Pending'}
                    </Badge>
                  </>
                )}
                {form.domain_type === 'sub_domain' && settings?.subdomain && (
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
                  {form.first_name} {form.last_name}
                </span>
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{form.email_id}</span>
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{form.mobile || 'Not set'}</span>
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{form.address || 'Not set'}</span>
                <span className="text-gray-600">Skype:</span>
                <span className="font-medium">{form.skype || 'Not set'}</span>
                <span className="text-gray-600">Publish:</span>
                <span className="font-medium">
                  {form.publish_on_site ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Branding</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Site Name:</span>
                <span className="font-medium">{form.site_name}</span>
                <span className="text-gray-600">Logo:</span>
                <span className="font-medium">
                  {logoFile
                    ? `New: ${logoFile.name}`
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
                  {form.nht_website_link || 'Not set'}
                </span>
                <span className="text-gray-600">Store:</span>
                <span className="font-medium break-all">
                  {form.nht_store_link || 'Not set'}
                </span>
                <span className="text-gray-600">Joining:</span>
                <span className="font-medium break-all">
                  {form.nht_joining_link || 'Not set'}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    websiteStep, 
    renderValidationErrors, 
    renderDNSInstructions, 
    form, 
    settings, 
    loading, 
    dnsLoading,
    logoFile,
    handleDomainTypeChange, 
    handleWebsiteDataChange, 
    handleRefreshDNSStatus,
    showDNSInstructions,
    renderGeneralDNSPreview
  ]);

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
    <div className="bg-white min-h-screen p-6">
      <ToastNotification />

      {loading && !settings && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      )}

      {!showForm && settings && !loading && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Store Settings</CardTitle>
            <Button onClick={() => dispatch(openForm())}>
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
                              settings.custom_domain_status === 'verified'
                                ? 'bg-green-500'
                                : settings.custom_domain_status === 'pending'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }
                          >
                            {settings.custom_domain_status === 'verified' ? '✅ Verified' : 
                             settings.custom_domain_status === 'pending' ? '⏳ Pending Verification' : '❌ Unverified'}
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

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Edit Store Settings</CardTitle>
            <Button
              variant="outline"
              onClick={handleResetForm}
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