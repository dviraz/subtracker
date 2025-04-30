import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: string;
  category: string;
  nextBilling: Date;
  isFreeTrial?: boolean;
  trialEndDate?: Date;
  originalCost?: number;
}

const SubscriptionTracker: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'nextBilling' || key === 'trialEndDate') {
        return value ? new Date(value) : null;
      }
      return value;
    }) : [];
  });

  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const [newSubscription, setNewSubscription] = useState({
    name: '',
    cost: '',
    currency: '€',
    billingCycle: 'Monthly',
    category: 'Entertainment',
    nextBilling: formattedToday,
    isFreeTrial: false,
    trialDays: '30' // Default 30-day trial
  });

  const [displayCurrency, setDisplayCurrency] = useState('₪');
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : ['Entertainment', 'Productivity', 'Other'];
  });

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const convertCurrency = (amount: number, from: string, to: string): number => {
    const rates = {
      '€': { '₪': 3.95, '$': 1.08 },
      '$': { '₪': 3.65, '€': 0.93 },
      '₪': { '€': 0.25, '$': 0.27 }
    };

    if (from === to) return amount;
    return Number((amount * rates[from as keyof typeof rates][to as keyof typeof rates[keyof typeof rates]]).toFixed(2));
  };

  const formatCurrency = (amount: number, currency: string): string => {
    if (currency === '₪') {
      return `₪${amount.toFixed(2)}`;
    }
    return `${currency}${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date): string => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscription.name || !newSubscription.cost) return;

    let nextBillingDate = new Date(newSubscription.nextBilling);
    let trialEndDate: Date | undefined;

    if (newSubscription.isFreeTrial) {
      trialEndDate = addDays(nextBillingDate, parseInt(newSubscription.trialDays || '30'));
      nextBillingDate = trialEndDate; // Set next billing to after trial period
    }

    const subscription: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.name,
      cost: Number(newSubscription.cost),
      currency: newSubscription.currency,
      billingCycle: newSubscription.billingCycle,
      category: newSubscription.category,
      nextBilling: nextBillingDate,
      isFreeTrial: newSubscription.isFreeTrial,
      trialEndDate: trialEndDate
    };

    setSubscriptions([...subscriptions, subscription]);
    setNewSubscription({
      name: '',
      cost: '',
      currency: '€',
      billingCycle: 'Monthly',
      category: 'Entertainment',
      nextBilling: formattedToday,
      isFreeTrial: false,
      trialDays: '30'
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const addCategory = () => {
    const category = prompt('Enter new category name:');
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const calculateRenewalWarning = (nextBilling: Date): boolean => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return nextBilling <= sevenDaysFromNow && nextBilling >= now;
  };

  const exportData = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'subscriptions.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setSubscriptions(importedData.map((sub: any) => ({
            ...sub,
            nextBilling: new Date(sub.nextBilling),
            trialEndDate: sub.trialEndDate ? new Date(sub.trialEndDate) : undefined
          })));
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const calculateTotalCost = (): number => {
    return subscriptions.reduce((total, sub) => {
      const convertedCost = convertCurrency(sub.cost, sub.currency, displayCurrency);
      return total + convertedCost;
    }, 0);
  };

  const hasUpcomingRenewals = subscriptions.some(sub => calculateRenewalWarning(sub.nextBilling));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Subscription Tracker</h1>
      
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <label className="mr-2">Display Currency:</label>
          <select
            value={displayCurrency}
            onChange={(e) => setDisplayCurrency(e.target.value)}
            className="border rounded p-1"
          >
            <option value="₪">₪</option>
            <option value="€">€</option>
            <option value="$">$</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={exportData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Export Data
          </button>
          <label className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Subscription Name"
          value={newSubscription.name}
          onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
          className="border rounded p-2"
        />
        <div className="flex">
          <select
            value={newSubscription.currency}
            onChange={(e) => setNewSubscription({ ...newSubscription, currency: e.target.value })}
            className="border rounded-l p-2"
          >
            <option value="€">€</option>
            <option value="$">$</option>
            <option value="₪">₪</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Cost"
            value={newSubscription.cost}
            onChange={(e) => setNewSubscription({ ...newSubscription, cost: e.target.value })}
            className="border-t border-b border-r rounded-r p-2"
          />
        </div>
        <select
          value={newSubscription.billingCycle}
          onChange={(e) => setNewSubscription({ ...newSubscription, billingCycle: e.target.value })}
          className="border rounded p-2"
        >
          <option>Monthly</option>
          <option>Yearly</option>
          <option>Weekly</option>
        </select>
        <select
          value={newSubscription.category}
          onChange={(e) => setNewSubscription({ ...newSubscription, category: e.target.value })}
          className="border rounded p-2"
        >
          {categories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newSubscription.isFreeTrial}
            onChange={(e) => setNewSubscription({ ...newSubscription, isFreeTrial: e.target.checked })}
            className="form-checkbox"
          />
          <span>Free Trial</span>
        </label>
        {newSubscription.isFreeTrial && (
          <input
            type="number"
            placeholder="Trial Days"
            value={newSubscription.trialDays}
            onChange={(e) => setNewSubscription({ ...newSubscription, trialDays: e.target.value })}
            className="border rounded p-2 w-24"
            min="1"
          />
        )}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={addCategory}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Manage Categories
        </button>
      </div>

      {hasUpcomingRenewals && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="flex items-center">
            <span>You have upcoming renewals in the next 7 days! Check the items marked with a</span>
            <span className="text-yellow-500 mx-1">⚠</span>
            <span>below.</span>
          </p>
        </div>
      )}

      {categories.map(category => {
        const categorySubscriptions = subscriptions.filter(sub => sub.category === category);
        if (categorySubscriptions.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="space-y-4">
              {categorySubscriptions.map(subscription => (
                <div
                  key={subscription.id}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded shadow"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{subscription.name}</span>
                    {calculateRenewalWarning(subscription.nextBilling) && (
                      <span className="text-yellow-500">⚠</span>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <div>
                      {subscription.isFreeTrial && subscription.trialEndDate ? (
                        <>
                          Trial ends: {formatDate(subscription.trialEndDate)}
                          <br />
                          Billing starts: {formatDate(subscription.nextBilling)}
                        </>
                      ) : (
                        <>Next billing: {formatDate(subscription.nextBilling)}</>
                      )} ({subscription.billingCycle.toLowerCase()})
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(convertCurrency(subscription.cost, subscription.currency, displayCurrency), displayCurrency)} / {subscription.billingCycle.toLowerCase()}
                      {subscription.originalCost && (
                        <span className="text-gray-500 ml-2">
                          (Original: {formatCurrency(subscription.originalCost, subscription.currency)})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteSubscription(subscription.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>Monthly Cost: {formatCurrency(calculateTotalCost(), displayCurrency)}</p>
      </div>
    </div>
  );
};

export default SubscriptionTracker;
