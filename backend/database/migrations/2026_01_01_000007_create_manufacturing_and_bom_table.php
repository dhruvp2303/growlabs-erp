<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills_of_materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->uuid('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('version', 50)->default('v1.0');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('bom_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bom_id')->references('id')->on('bills_of_materials')->onDelete('cascade');
            $table->uuid('raw_material_product_id')->references('id')->on('products')->onDelete('restrict');
            $table->decimal('quantity_required', 10, 3);
            $table->string('unit_of_measure', 50);
        });

        Schema::create('production_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->uuid('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->integer('target_quantity');
            $table->string('plant_location', 100)->nullable();
            $table->string('stage', 50)->default('planned');
            $table->integer('progress_percentage')->default(0);
            $table->date('due_date')->nullable();
            $table->timestamps();
            $table->unique(['company_id', 'reference']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_orders');
        Schema::dropIfExists('bom_items');
        Schema::dropIfExists('bills_of_materials');
    }
};
