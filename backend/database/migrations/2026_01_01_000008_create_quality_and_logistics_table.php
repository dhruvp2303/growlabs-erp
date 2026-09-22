<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quality_inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->uuid('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->integer('passed_units')->default(0);
            $table->integer('failed_units')->default(0);
            $table->decimal('pass_rate', 5, 2)->default(100.00);
            $table->string('status', 50)->default('pass');
            $table->timestamps();
        });

        Schema::create('shipments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->string('customer_name');
            $table->string('carrier');
            $table->string('origin');
            $table->string('destination');
            $table->integer('progress_percentage')->default(0);
            $table->date('eta')->nullable();
            $table->string('status', 50)->default('preparing');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
        Schema::dropIfExists('quality_inspections');
    }
};
