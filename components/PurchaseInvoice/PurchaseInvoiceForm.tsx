import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Current } from "@/components/CurrentList/types";
import { usePurchaseInvoiceForm } from "./hooks/usePurchaseInvoiceForm";
import PurchaseInvoiceItems from "@/components/PurchaseInvoice/PurchaseInvoiceItems";

interface PurchaseInvoiceFormProps {
  current: Current;
}

const formSchema = z.object({
  invoiceNo: z.string().min(1, "Invoice number is required"),
  gibInvoiceNo: z.string().min(1, "GIB invoice number is required"),
  invoiceDate: z.date(),
  paymentDate: z.date(),
  paymentTerm: z.number().min(0),
  branchCode: z.string().min(1, "Branch selection is required"),
  warehouseId: z.string().min(1, "Warehouse selection is required"),
  description: z.string().optional(),
});

const PurchaseInvoiceForm: React.FC<PurchaseInvoiceFormProps> = ({
  current,
}) => {
  const [isSerialInvoice, setIsSerialInvoice] = useState(false);
  const [isSerialGib, setIsSerialGib] = useState(false);
  const {
    branches,
    warehouses,
    generateInvoiceNumber,
    generateGibNumber,
    isLoading,
  } = usePurchaseInvoiceForm();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: "",
      gibInvoiceNo: "",
      invoiceDate: new Date(),
      paymentDate: new Date(),
      paymentTerm: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (isSerialInvoice) {
      form.setValue("invoiceNo", generateInvoiceNumber());
    }
  }, [isSerialInvoice, form, generateInvoiceNumber]);

  useEffect(() => {
    if (isSerialGib) {
      form.setValue("gibInvoiceNo", generateGibNumber());
    }
  }, [isSerialGib, form, generateGibNumber]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Invoice Numbers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="invoiceNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Fatura No</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSerialInvoice} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2 ml-4 mt-8">
                <Switch
                  checked={isSerialInvoice}
                  onCheckedChange={setIsSerialInvoice}
                />
                <FormLabel>Seri</FormLabel>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="gibInvoiceNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>GİB No</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSerialGib} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2 ml-4 mt-8">
                <Switch
                  checked={isSerialGib}
                  onCheckedChange={setIsSerialGib}
                />
                <FormLabel>Seri</FormLabel>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fatura Tarihi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Tarih seçin</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ödeme Tarihi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Tarih seçin</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vade (Gün)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Selections */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şube</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Şube seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.branchCode}>
                          {branch.branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Depo seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.warehouseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Açıklama giriniz..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <PurchaseInvoiceItems
          selectedWarehouseId={form.watch("warehouseId")}
          customer={current}
        />
      </form>
    </Form>
  );
};

export default PurchaseInvoiceForm;
