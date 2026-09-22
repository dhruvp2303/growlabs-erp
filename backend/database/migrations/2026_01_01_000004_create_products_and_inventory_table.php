<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('sku', 100);
            $table->string('name');
            $table->string('type', 50)->default('finished_goods');
            $table->string('category', 100)->nullable();
            $table->string('unit_of_measure', 50)->default('units');
            $table->decimal('unit_cost', 15, 2)->default(0.00);
            $table->decimal('unit_price', 15, 2)->default(0.00);
            $table->integer('safety_stock_threshold')->default(0);
            $table->timestamps();
            $table->unique(['company_id', 'sku']);
        });

        Schema::create('warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('code', 50);
            $table->string('name');
            $table->string('location')->nullable();
            $table->integer('capacity_limit')->default(10000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['company_id', 'code']);
        });

        Schema::create('stock_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->uuid('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
            $table->uuid('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->integer('physical_quantity')->default(0);
            $table->integer('reserved_quantity')->default(0);
            $table->integer('blocked_quantity')->default(0);
            $table->timestamps();
            $table->unique(['warehouse_id', 'product_id']);
        });

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->uuid('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->uuid('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
            $table->string('movement_type', 50); // 'inbound_po', 'outbound_so', 'adjustment'
            $table->integer('quantity_delta');
            $table->string('reference_type', 50)->nullable();
            $table->uuid('reference_id')->nullable();
            $table->string('batch_number', 100)->nullable();
            $table->uuid('performed_by')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stock_items');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('products');
    }
};
