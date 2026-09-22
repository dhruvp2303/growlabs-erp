<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('name');
            $table->string('category')->nullable();
            $table->integer('lead_time_days')->default(7);
            $table->decimal('on_time_delivery_rate', 5, 2)->default(100.00);
            $table->decimal('quality_rating_score', 5, 2)->default(100.00);
            $table->string('status', 50)->default('approved');
            $table->timestamps();
        });

        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->uuid('supplier_id')->references('id')->on('suppliers')->onDelete('restrict');
            $table->date('order_date');
            $table->date('expected_delivery_date')->nullable();
            $table->decimal('total_amount', 15, 2)->default(0.00);
            $table->string('status', 50)->default('draft');
            $table->timestamps();
            $table->unique(['company_id', 'reference']);
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('purchase_order_id')->references('id')->on('purchase_orders')->onDelete('cascade');
            $table->uuid('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('suppliers');
    }
};
