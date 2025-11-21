import React from "react";
import { Button, Card, CardBody, Input, Switch, Tooltip, Divider, Tabs, Tab } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const ProfilePage: React.FC<{ navigateTo: (view: string) => void }> = ({ navigateTo }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("personal");

  // Personal information
  const [fullName, setFullName] = React.useState("John Contractor");
  const [jobTitle, setJobTitle] = React.useState("Project Manager");
  const [email, setEmail] = React.useState("john@acmeconstruction.com");
  const [phone, setPhone] = React.useState("+1 (555) 123-4567");
  const [profileImage, setProfileImage] = React.useState("");

  // Account settings
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  // Company information
  const [companyName, setCompanyName] = React.useState("Acme Construction");
  const [companyAddress, setCompanyAddress] = React.useState("123 Builder St, Construction City, CC 12345");
  const [businessLicense, setBusinessLicense] = React.useState("LIC-12345-CC");
  const [companyLogo, setCompanyLogo] = React.useState("");

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save the changes to the server here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to the server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to the server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-foreground-200 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigateTo("landing")}
          >
            <Icon
              icon="lucide:layers"
              className="text-primary h-7 w-7 mr-2"
            />
            <span className="font-gilroy font-bold text-xl">Paperstack</span>
          </div>

          <div className="flex items-center space-x-6">
            <Button
              variant="light"
              onPress={() => navigateTo("dashboard")}
              startContent={<Icon icon="lucide:arrow-left" className="h-4 w-4" />}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-gilroy text-2xl md:text-3xl font-bold mb-1">Profile</h1>
            <p className="text-foreground-500">Manage your account and preferences</p>
          </div>

          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <Button
                  variant="flat"
                  color="default"
                  onPress={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                color="primary"
                startContent={<Icon icon="lucide:edit" className="h-4 w-4" />}
                onPress={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "w-full",
              tab: "max-w-fit px-0 h-12"
            }}
          >
            <Tab
              key="personal"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user" className="h-4 w-4" />
                  <span>Personal Information</span>
                </div>
              }
            />
            <Tab
              key="account"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:shield" className="h-4 w-4" />
                  <span>Account Settings</span>
                </div>
              }
            />
            <Tab
              key="company"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:building" className="h-4 w-4" />
                  <span>Company Information</span>
                </div>
              }
            />
          </Tabs>
        </div>

        {activeTab === "personal" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 rounded-full bg-foreground-200 overflow-hidden">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Icon icon="lucide:user" className="h-16 w-16 text-foreground-400" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="profile-image-upload" className="cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                              <Icon icon="lucide:camera" className="h-4 w-4" />
                            </div>
                            <input
                              id="profile-image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfileImageUpload}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-foreground-500">
                      Profile photo helps your team recognize you
                    </p>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-gilroy text-xl font-bold mb-6">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-foreground-700 mb-1">
                          Full Name
                        </label>
                        {isEditing ? (
                          <Input
                            id="fullName"
                            value={fullName}
                            onValueChange={setFullName}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground-900">{fullName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-foreground-700 mb-1">
                          Job Title / Role
                        </label>
                        {isEditing ? (
                          <Input
                            id="jobTitle"
                            value={jobTitle}
                            onValueChange={setJobTitle}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground-900">{jobTitle}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground-700 mb-1">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={phone}
                            onValueChange={setPhone}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground-900">{phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {activeTab === "account" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <h2 className="font-gilroy text-xl font-bold mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-dmsans font-semibold mb-4">Password</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground-900">Password</p>
                        <p className="text-sm text-foreground-500">Last changed 3 months ago</p>
                      </div>
                      <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="font-dmsans font-semibold mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground-900">Two-Factor Authentication</p>
                        <p className="text-sm text-foreground-500">
                          {twoFactorEnabled
                            ? "Enabled - Using Authenticator App"
                            : "Disabled - Your account is less secure"
                          }
                        </p>
                      </div>
                      <Switch
                        isSelected={twoFactorEnabled}
                        onValueChange={setTwoFactorEnabled}
                        color="primary"
                      />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="font-dmsans font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground-900">Email Notifications</p>
                          <p className="text-sm text-foreground-500">
                            Receive updates, alerts, and notifications via email
                          </p>
                        </div>
                        <Switch
                          isSelected={emailNotifications}
                          onValueChange={setEmailNotifications}
                          color="primary"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground-900">Push Notifications</p>
                          <p className="text-sm text-foreground-500">
                            Receive notifications directly in the app
                          </p>
                        </div>
                        <Switch
                          isSelected={pushNotifications}
                          onValueChange={setPushNotifications}
                          color="primary"
                        />
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="font-dmsans font-semibold mb-4 text-danger">Danger Zone</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground-900">Delete Account</p>
                        <p className="text-sm text-foreground-500">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {activeTab === "company" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="ambient-shadow mb-8">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 rounded-lg bg-foreground-200 overflow-hidden border border-foreground-200">
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt="Company Logo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Icon icon="lucide:building" className="h-16 w-16 text-foreground-400" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="company-logo-upload" className="cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                              <Icon icon="lucide:camera" className="h-4 w-4" />
                            </div>
                            <input
                              id="company-logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleCompanyLogoUpload}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-foreground-500">
                      Company logo appears on documents and reports
                    </p>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-gilroy text-xl font-bold mb-6">Company Information</h2>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-foreground-700 mb-1">
                          Company Name
                        </label>
                        {isEditing ? (
                          <Input
                            id="companyName"
                            value={companyName}
                            onValueChange={setCompanyName}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground-900">{companyName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="companyAddress" className="block text-sm font-medium text-foreground-700 mb-1">
                          Company Address
                        </label>
                        {isEditing ? (
                          <Input
                            id="companyAddress"
                            value={companyAddress}
                            onValueChange={setCompanyAddress}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-foreground-900">{companyAddress}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="businessLicense" className="block text-sm font-medium text-foreground-700 mb-1">
                          Business License / Registration Number
                        </label>
                        <div className="flex items-center">
                          {isEditing ? (
                            <Input
                              id="businessLicense"
                              value={businessLicense}
                              onValueChange={setBusinessLicense}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-foreground-900">{businessLicense}</p>
                          )}
                          <Tooltip content="Used for tax reporting and compliance">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="ml-2"
                            >
                              <Icon icon="lucide:info" className="h-4 w-4 text-foreground-500" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-dmsans font-semibold mb-2">Construction-Specific Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center p-3 border border-foreground-200 rounded-md">
                            <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                              <Icon icon="lucide:hard-hat" className="h-5 w-5 text-primary-500" />
                            </div>
                            <div>
                              <p className="font-medium">Contractor License</p>
                              <p className="text-sm text-foreground-500">CONT-98765-AB</p>
                            </div>
                          </div>

                          <div className="flex items-center p-3 border border-foreground-200 rounded-md">
                            <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mr-4">
                              <Icon icon="lucide:shield-check" className="h-5 w-5 text-primary-500" />
                            </div>
                            <div>
                              <p className="font-medium">Insurance Policy</p>
                              <p className="text-sm text-foreground-500">INS-45678-CD</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};