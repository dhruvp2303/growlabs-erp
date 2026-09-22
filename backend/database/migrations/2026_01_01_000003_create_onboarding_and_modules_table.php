<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('erp_modules', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // 'inventory', 'sales', etc.
            $table->string('name');
            $table->string('category');
            $table->decimal('monthly_price', 10, 2)->default(0.00);
            $table->jsonb('required_dependencies')->default('[]');
        });

        Schema::create('company_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('module_id', 50)->references('id')->on('erp_modules')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamp('activated_at')->useCurrent();
            $table->timestamps();
            $table->unique(['company_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_modules');
        Schema::dropIfExists('erp_modules');
    }
};
