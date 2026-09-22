<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('segment')->nullable();
            $table->string('location')->nullable();
            $table->decimal('credit_limit', 15, 2)->default(0.00);
            $table->string('status', 50)->default('active');
            $table->timestamps();
        });

        Schema::create('sales_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->uuid('customer_id')->references('id')->on('customers')->onDelete('restrict');
            $table->date('order_date');
            $table->decimal('total_amount', 15, 2)->default(0.00);
            $table->integer('fulfillment_percentage')->default(0);
            $table->string('status', 50)->default('pending');
            $table->timestamps();
            $table->unique(['company_id', 'reference']);
        });

        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sales_order_id')->references('id')->on('sales_orders')->onDelete('cascade');
            $table->uuid('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_order_items');
        Schema::dropIfExists('sales_orders');
        Schema::dropIfExists('customers');
    }
};
